﻿﻿using Expressive.Expressions;
using System;

namespace Expressive.Functions.Mathematical
{
    internal class TruncateFunction : FunctionBase
    {
        #region FunctionBase Members

        public override string Name { get { return "Trunc"; } }

        public override object Evaluate(IExpression[] parameters, ExpressiveOptions options)
        {
            this.ValidateParameterCount(parameters, 1, 1);

            return Convert.ToDecimal(Math.Truncate(Convert.ToDouble(parameters[0].Evaluate(Variables))));
        }

        #endregion
    }
}
