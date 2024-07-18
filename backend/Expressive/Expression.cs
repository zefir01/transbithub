﻿﻿//Copyright(c) 2019 Shaun Lawrence

//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

using Expressive.Exceptions;
using Expressive.Expressions;
using Expressive.Functions;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Expressive
{
    /// <summary>
    /// Class definition for an Expression that can be evaluated.
    /// </summary>
    public sealed class Expression : IExpression
    {
        #region Fields

        private IExpression compiledExpression;
        private readonly ExpressiveOptions options;
        private readonly string originalExpression;
        private readonly ExpressionParser parser;
        private string[] referencedVariables;

        #endregion

        #region Properties

        /// <summary>
        /// Gets a list of the Variable names that are contained within this Expression.
        /// </summary>
        public string[] ReferencedVariables
        {
            get
            {
                this.CompileExpression();

                return this.referencedVariables;
            }
        }

        #endregion

        #region Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="Expression"/> class with the specified options.
        /// </summary>
        /// <param name="expression">The expression to be evaluated.</param>
        /// <param name="options">The options to use when evaluating.</param>
        public Expression(string expression, ExpressiveOptions options = ExpressiveOptions.None)
        {
            this.originalExpression = expression;
            this.options = options;

            this.parser = new ExpressionParser(this.options);
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Evaluates the expression using the supplied variables and returns the result.
        /// </summary>
        /// <exception cref="Exceptions.ExpressiveException">Thrown when there is a break in the evaluation process, check the InnerException for further information.</exception>
        /// <param name="variables">The variables to be used in the evaluation.</param>
        /// <returns>The result of the expression.</returns>
        public object Evaluate(IDictionary<string, object> variables = null)
        {
            try
            {
                this.CompileExpression();

                if (variables != null &&
                    this.options.HasFlag(ExpressiveOptions.IgnoreCase))
                {
                    variables = new Dictionary<string, object>(variables, StringComparer.OrdinalIgnoreCase);
                }

                return this.compiledExpression?.Evaluate(variables);
            }
            catch (Exception ex)
            {
                throw new ExpressiveException(ex);
            }
        }

        /// <summary>
        /// Evaluates the expression using the supplied variables and returns the result.
        /// </summary>
        /// <exception cref="Exceptions.ExpressiveException">Thrown when there is a break in the evaluation process, check the InnerException for further information.</exception>
        /// <param name="variables">The variables to be used in the evaluation.</param>
        /// <returns>The result of the expression.</returns>
        public T Evaluate<T>(IDictionary<string, object> variables = null)
        {
            try
            {
                return (T)this.Evaluate(variables);
            }
            catch (ExpressiveException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new ExpressiveException(ex);
            }
        }

        /// <summary>
        /// Evaluates the expression using the supplied variables asynchronously and returns the result via the callback.
        /// </summary>
        /// <exception cref="System.ArgumentNullException">Thrown if the callback is not supplied.</exception>
        /// <param name="callback">Provides the result once the evaluation has completed.</param>
        /// <param name="variables">The variables to be used in the evaluation.</param>
        public void EvaluateAsync(Action<string, object> callback, IDictionary<string, object> variables = null)
        {
            this.EvaluateAsync<object>(callback, variables);
        }

        /// <summary>
        /// Evaluates the expression using the supplied variables asynchronously and returns the result via the callback.
        /// </summary>
        /// <exception cref="System.ArgumentNullException">Thrown if the callback is not supplied.</exception>
        /// <param name="callback">Provides the result once the evaluation has completed.</param>
        /// <param name="variables">The variables to be used in the evaluation.</param>
        public void EvaluateAsync<T>(Action<string, T> callback, IDictionary<string, object> variables = null)
        {
            if (callback == null)
            {
                throw new ArgumentNullException(nameof(callback));
            }

#if NETSTANDARD1_4
            Task.Run(() =>
#else
            ThreadPool.QueueUserWorkItem((o) =>
#endif
            {
                var result = default(T);
                string message = null;

                try
                {
                    result = this.Evaluate<T>(variables);
                }
                catch (ExpressiveException ex)
                {
                    message = ex.Message;
                }

                callback.Invoke(message, result);
            });
        }

        /// <summary>
        /// Registers a custom function for use in evaluating an expression.
        /// </summary>
        /// <param name="functionName">The name of the function (NOTE this is also the tag that will be used to extract the function from an expression).</param>
        /// <param name="function">The method of evaluating the function.</param>
        /// <exception cref="Exceptions.FunctionNameAlreadyRegisteredException">Thrown when the name supplied has already been registered.</exception>
        public void RegisterFunction(string functionName, Func<IExpression[], IDictionary<string, object>, object> function)
        {
            this.parser.RegisterFunction(functionName, function);
        }

        /// <summary>
        /// Registers a custom function inheriting from <see cref="IFunction"/> for use in evaluating an expression.
        /// </summary>
        /// <param name="function">The <see cref="IFunction"/> implementation.</param>
        /// <exception cref="Exceptions.FunctionNameAlreadyRegisteredException">Thrown when the name supplied has already been registered.</exception>
        public void RegisterFunction(IFunction function)
        {
            this.parser.RegisterFunction(function);
        }

        #endregion

        #region Private Methods

        private void CompileExpression()
        {
            // Cache the expression to save us having to recompile.
            if (this.compiledExpression == null ||
                this.options.HasFlag(ExpressiveOptions.NoCache))
            {
                var variables = new List<string>();

                this.compiledExpression = this.parser.CompileExpression(this.originalExpression, variables);

                this.referencedVariables = variables.ToArray();
            }
        }

        #endregion
    }
}
