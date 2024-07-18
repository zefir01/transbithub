﻿﻿using Expressive.Expressions;
using Expressive.Expressions.Binary.Multiplicative;

namespace Expressive.Operators.Multiplicative
{
    internal class ModulusOperator : OperatorBase
    {
        #region OperatorBase Members

        public override string[] Tags => new[] { "%"};

        public override IExpression BuildExpression(Token previousToken, IExpression[] expressions, ExpressiveOptions options)
        {
            return new ModulusExpression(expressions[0], expressions[1], options);
        }

        public override OperatorPrecedence GetPrecedence(Token previousToken)
        {
            return OperatorPrecedence.Modulus;
        }

        #endregion
    }
}