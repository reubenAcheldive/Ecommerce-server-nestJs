import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OrderSchemaDto } from "../../../dtos/order/orderSchema.dto";
import maskCardNumber from "src/utils/maskCard";
import calculateTotalPrice from "src/utils/TotlPrice";
import { CartServices } from "../../carts/services/cart.services";

import { PaymentService } from "../../payment/services/payment.service";
import { GeneratorPDfService } from "../../pdf/services/generatorPDf.service";
import { AddressService } from "../../address/services/address.service";
import * as fs from "fs";

import { UsersService } from "../../user/service/users.service";

@Injectable()
export class OrderServices {
  constructor(
    @InjectModel("Orders") private orderDb: Model<OrderSchemaDto>,
    private cartServices: CartServices,
    private paymentServices: PaymentService,
    private addressServices: AddressService,
    private generatorPDfService: GeneratorPDfService,
    private userService: UsersService
  ) {}

  createNewOrder = async ({
    customerRef,
    paymentRef,
    items,
    cartRef,
    dateDelivery,
  }: Omit<OrderSchemaDto, "addressRef" | "userName">) => {
    const payment = await this.paymentServices.getOnePaymentDetails({
      _id: paymentRef.idPayment,
    });

    const getDefaultAddressByCustomer =
      await this.addressServices.findDefaultAddress({ customerRef });
    const { totalPrice, dateOfCreateOrder } = await this.otilsForOrder(items);
    const user = await this.userService.findUserById(customerRef);

    const createNewOrder: any = await this.orderDb.create({
      userName: `${user.firstName} ${user.lastName}`,
      cartRef,
      customerRef,
      paymentRef: {
        idPayment: payment?._id,
        cardNumberMask: maskCardNumber(payment.cardNumber),
      },
      totalPrice,
      dateOfCreateOrder,
      addressRef: getDefaultAddressByCustomer[0],
      dateDelivery: String(new Date(dateDelivery)),
      items,
    });
    if (createNewOrder as any) {
      const t = await this.generatorPDfService.createInvoice(createNewOrder);

      try {
        await fs.appendFileSync(
          `./src/orderFiles/${createNewOrder._id}.pdf`,
          t,
          "binary"
        );
      } catch (error) {
        new Error("Generated File is Fail");
      }

      const updateCart = await this.cartServices.updateCart(cartRef, 2);
      if (updateCart) {
        const cart = await this.cartServices.createNewCart(customerRef);
        return { cart, IdOrder: createNewOrder._id };
      }
    }
  };

  getDetailsOrder = async (_id: string) => {
    const getOrder = await this.orderDb.find({ _id });

    return getOrder[0];
  };

  getAllOrder = async () => {
    const quantityOrders = await this.orderDb.find({});

    return quantityOrders.length;
  };

  getAvailableOrderDate = async () => {
    const date = await this.orderDb
      .aggregate([{ $group: { _id: "$DateDelivery", count: { $sum: 1 } } }])
      .exec();
    const dateAvailable = date
      .filter(({ count, _id }) => {
        if (count < 3) {
          return;
        }
        return count;
      })
      .map(({ _id }) => {
        return _id;
      });
    return dateAvailable;
  };

  private async otilsForOrder(
    items: [
      {
        quantity: number;
        productRefId: {
          _id: string;
          name: string;
          categoryRef: string;
          price: number;
          imgUrl: string;
          description: string;
        };
        _id: string;
      }
    ]
  ) {
    const totalPrice = calculateTotalPrice(items as any).toFixed(2);
    const dateOfCreateOrder = String(new Date());
    return { totalPrice, dateOfCreateOrder };
  }

  async checkDateDelivery(DateDelivery) {
    return await this.orderDb.find({ DateDelivery });
  }

  async getLastIdOrderByCartID({ cartId }: { cartId: string }) {
    return this.orderDb.findOne({}, { cartRef: cartId });
  }
}

// order
// userRef
//itemList
//cartId
// get current address by address _id
//get current Payment by Payment _id
//close cart to statues 2 and create new Cart
//time close order
//total Price from cart items
//date to shipment
