'use client';

import React from 'react';
import OrderListItem from '@/components/molecules/orderListItem/OrderListItem';
import { Project } from '@/types/project';
import { Contract } from '@/types/contract';

type OrderItemType = Project | Contract;

interface OrderListProps {
  orders: OrderItemType[];
  onAskButtonClick: (orderId: number) => void;
  onClickProject: (id: number) => void;
  isExpertView?: boolean;
}

export default function OrderList({
  orders,
  onAskButtonClick,
  onClickProject,
  isExpertView = false,
}: OrderListProps) {
  return (
    <div className="flex flex-col gap-16">
      {orders.map(order => {
        const id = 'id' in order ? order.id : order.contractId;
        return (
          <OrderListItem
            key={id}
            item={order}
            onClickAskButton={() => onAskButtonClick(id)}
            onClickProject={() => onClickProject(id)}
            isExpertView={isExpertView}
          />
        );
      })}
    </div>
  );
}
