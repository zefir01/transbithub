﻿using Expressive.Expressions;
using System;

namespace Expressive.Functions.Mathematical
{
    internal class RoundFunction : FunctionBase
    {
        #region FunctionBase Members

        public override string Name { get { return "Round"; } }

        public override object Evaluate(IExpression[] parameters, ExpressiveOptions options)
        {
            this.ValidateParameterCount(parameters, -1, 1);

            if(parameters.Length==2)
                return Math.Round(Convert.ToDecimal(parameters[0].Evaluate(Variables)), Convert.ToInt32(parameters[1].Evaluate(Variables)));
            return Math.Round(Convert.ToDecimal(parameters[0].Evaluate(Variables)));
        }

        #endregion
    }
}
