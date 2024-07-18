﻿﻿using System.Collections.Generic;
using Expressive.Helpers;

namespace Expressive.Expressions.Binary.Additive
{
    internal class SubtractExpression : BinaryExpressionBase
    {
        #region Constructors

        public SubtractExpression(IExpression lhs, IExpression rhs, ExpressiveOptions options) : base(lhs, rhs, options)
        {
        }

        #endregion

        #region BinaryExpressionBase Members

        protected override object EvaluateImpl(object lhsResult, IExpression rightHandSide, IDictionary<string, object> variables) =>
            this.Evaluate(lhsResult, rightHandSide, variables, Numbers.Subtract);

        #endregion
    }
}
