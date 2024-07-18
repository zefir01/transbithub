using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using CoreLib.Entitys.UserDataParts;
using Shared;

namespace CoreLib.Entitys
{
    public class DealFeedBack
    {
        [Key]
        public long Id { get; private set; }
        public virtual UserData From { get; private set; }
        public virtual UserData To { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public bool IsPositive { get; private set; }
        public string Text { get; private set; }

        public DealFeedBack([NotNull] UserData from, [NotNull] UserData to, bool isPositive, [NotNull] string text)
        {
            if (text.Length > 1000)
                throw new UserException("Feedback length must be <= 1000 symbols.");

            From = from;
            To = to;
            CreatedAt = DateTime.Now;
            IsPositive = isPositive;
            Text = text;
        }
        public DealFeedBack(){}
    }
}