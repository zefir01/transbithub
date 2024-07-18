using System;
using CoreLib.Entitys.Invoices;
using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys.UserDataParts
{
    public partial class UserData
    {
        [Owned]
        public class BoughtOptions
        {
            public int AutoPrice { get; private set; }
            public virtual UserData Owner { get; private set; }

            public BoughtOptions()
            {
            }
            public BoughtOptions(UserData owner)
            {
                Owner = owner;
            }

            public void OnAutoPriceRecalc()
            {
                if (AutoPrice == 0)
                    throw new Exception("Insufficient recalcs to use AutoPrice.");
                AutoPrice -= 1;
            }

            public void OnPayed(InvoicePayment payment)
            {
                switch (payment.Invoice.IsService)
                {
                    case ServiceType.AutoPrice:
                        if(Owner.UserId == payment.Owner.UserId)
                            AutoPrice += payment.Invoice.PiecesMax;
                        break;
                }
            }
        }
    }
}