from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer, OrderListSerializer


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().prefetch_related('items')
        return Order.objects.filter(user=user).prefetch_related('items')

    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        return OrderSerializer

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        new_status = request.data.get('status')

        # Only staff can change to processing/shipped/delivered
        # Users can only cancel their own pending orders
        if not request.user.is_staff:
            if new_status != 'cancelled' or order.status != 'pending':
                return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)

        order.status = new_status
        order.save(update_fields=['status'])
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        if not request.user.is_staff:
            return Response({'detail': 'Admin only.'}, status=status.HTTP_403_FORBIDDEN)
        from django.db.models import Count, Sum
        stats = Order.objects.aggregate(
            total_orders=Count('id'),
            total_revenue=Sum('total_price')
        )
        return Response(stats)
