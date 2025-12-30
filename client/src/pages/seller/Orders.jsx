import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { dummyOrders } from "../../assets/assets";

const Orders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(dummyOrders);
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {orders.map(order => (
          <div
            key={order._id}
            className="flex flex-col md:flex-row md:items-center gap-5 p-5 justify-between max-w-4xl rounded-md border border-gray-300"
          >
            {/* ITEMS */}
            <div className="flex gap-5 max-w-80">
              <img
                className="w-12 h-12 object-cover"
                src={assets.box_icon}
                alt="box"
              />

              <div className="space-y-1">
                {order.items.map(item => (
                  <p key={item._id} className="font-medium">
                    {item.product.name}
                    <span className="text-primary">
                      {" "}x{item.quantity}
                    </span>
                  </p>
                ))}
              </div>
            </div>

     
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
