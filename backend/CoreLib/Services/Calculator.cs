using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using CoreLib.Entitys;
using Expressive;
using Shared;

namespace CoreLib.Services
{
    public class Calculator
    {
        private Dictionary<string, object> objVars = null;
        private readonly DataDBContext db;

        public Calculator(DataDBContext db)
        {
            this.db = db;
            db.Calculator = this;
        }

        public async Task UpdateVars()
        {
            var vars =await db.GetVariables(CancellationToken.None);
            objVars = vars.ToDictionary(p => p.key, p => p.value as object);
        }

        public void UpdateVars(List<CryptoExchangeVariable> cryptoVars, List<FiatExchangeVariable> fiatVars,
            List<AvgPrice> avgPrices)
        {
            var t1 = cryptoVars.Select(p => (p.Key.ToString(), p.Value));
            var t2 = fiatVars.Select(p => (p.Key.ToString(), p.Value));
            var t3 = avgPrices.Select(p => (p.Name, p.Value));
            var all = t1.Concat(t2).Concat(t3).ToList();
            objVars = all.ToDictionary(p => p.Item1, p => p.Value as object);
        }

        public async Task<decimal> Calc(string expression)
        {
            if (objVars == null)
                await UpdateVars();
            Regex regex = new Regex("[^0-9.]+");
            MatchCollection matches = regex.Matches(expression);
            if (matches.Count == 0)
                return decimal.Parse(expression);

            regex = new Regex("[a-zA-Z]+");
            matches = regex.Matches(expression);
            if (matches.Count > 0)
                foreach (var key in objVars.Keys)
                    expression = expression.Replace(key, "[" + key + "]");

            var e = new Expression(expression);

            decimal price = Math.Round(Convert.ToDecimal(e.Evaluate(objVars)), 2);
            if (price <= 0)
                throw new UserException("Price is less than or equal to zero.");
            return price;
        }
    }
}