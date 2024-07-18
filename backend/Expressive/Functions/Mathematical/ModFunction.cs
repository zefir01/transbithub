using System;
using Expressive.Expressions;

namespace Expressive.Functions.Mathematical
{
    internal class ModFunction : FunctionBase
    {
        #region FunctionBase Members

        public override string Name { get { return "Mod"; } }

        public override object Evaluate(IExpression[] parameters, ExpressiveOptions options)
        {
            this.ValidateParameterCount(parameters, 2, 2);

            return Convert.ToDecimal(parameters[0].Evaluate(Variables)) %
                   Convert.ToDecimal(parameters[1].Evaluate(Variables));
        }

        #endregion
    }
}