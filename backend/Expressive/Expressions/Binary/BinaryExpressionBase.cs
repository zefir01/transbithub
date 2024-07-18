﻿﻿using Expressive.Exceptions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Expressive.Expressions.Binary
{
    internal abstract class BinaryExpressionBase : IExpression
    {
        #region Fields

        private readonly IExpression leftHandSide;
        protected readonly ExpressiveOptions options;
        private readonly IExpression rightHandSide;

        #endregion

        #region Constructors

        internal BinaryExpressionBase(IExpression lhs, IExpression rhs, ExpressiveOptions options)
        {
            this.leftHandSide = lhs;
            this.options = options;
            this.rightHandSide = rhs;
        }

        #endregion

        #region IExpression Members

        public object Evaluate(IDictionary<string, object> variables)
        {
            if (this.leftHandSide == null)
            {
                throw new MissingParticipantException("The left hand side of the operation is missing.");
            }

            if (this.rightHandSide == null)
            {
                throw new MissingParticipantException("The right hand side of the operation is missing.");
            }

            // We will evaluate the left hand side but hold off on the right hand side as it may not be necessary
            var lhsResult = this.leftHandSide.Evaluate(variables);

            return this.EvaluateImpl(lhsResult, this.rightHandSide, variables);
        }

        #endregion

        private object CheckAndEvaluateSubExpression(object result, IDictionary<string, object> variables)
        {
            if (result is Expression lhsExpression)
            {
                return lhsExpression.Evaluate(variables);
            }

            return result;
        }
        
        protected abstract object EvaluateImpl(object lhsResult, IExpression rightHandSide, IDictionary<string, object> variables);

        protected object Evaluate(object lhsResult, IExpression rhs, IDictionary<string, object> variables, Func<object, object, object> resultSelector)
        {
            IList<object> lhsParticipants = new List<object>();
            IList<object> rhsParticipants = new List<object>();

            lhsResult = this.CheckAndEvaluateSubExpression(lhsResult, variables);
            var rhsResult = this.CheckAndEvaluateSubExpression(rhs.Evaluate(variables), variables);

            if (!(lhsResult is ICollection) && !(rhsResult is ICollection))
            {
                return resultSelector(lhsResult, rhsResult);
            }

            if (lhsResult is ICollection leftCollection)
            {
                foreach (var item in leftCollection)
                {
                    lhsParticipants.Add(item);
                }
            }
            if (rhsResult is ICollection rightCollection)
            {
                foreach (var item in rightCollection)
                {
                    rhsParticipants.Add(item);
                }
            }

            object[] result = null;

            if (lhsParticipants.Count == rhsParticipants.Count)
            {
                IList<object> resultList = new List<object>();

                for (var i = 0; i < lhsParticipants.Count; i++)
                {
                    resultList.Add(resultSelector(lhsParticipants[i], rhsParticipants[i]));
                }

                result = resultList.ToArray();
            }
            else if (lhsParticipants.Count == 0)
            {
                IList<object> resultList = new List<object>();

                for (var i = 0; i < rhsParticipants.Count; i++)
                {
                    resultList.Add(resultSelector(lhsResult, rhsParticipants[i]));
                }

                result = resultList.ToArray();
            }
            else if (rhsParticipants.Count == 0)
            {
                IList<object> resultList = new List<object>();

                for (var i = 0; i < lhsParticipants.Count; i++)
                {
                    resultList.Add(resultSelector(lhsParticipants[i], rhsResult));
                }

                result = resultList.ToArray();
            }

            return result;
        }
    }
}
