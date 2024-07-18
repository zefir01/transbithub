using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using CoreLib.Entitys.UserDataParts;

namespace CoreLib.Entitys
{

    public enum ComplaintStatus
    {
        Open,
        Closed
    }

    public class Complaint
    {
        [Key]
        public long Id { get; private set; }
        private UserData _From, _To;
        public UserData From => _From;
        public UserData To => _To;
        public string Text { get; private set; }
        public string FromContact { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public ComplaintStatus Status { get; private set; }

        public Complaint([NotNull] UserData from, [NotNull] UserData to, string text, string fromContact)
        {
            _From = @from;
            _To = to;
            Text = text;
            FromContact = fromContact;
            CreatedAt = DateTime.Now;
            Status = ComplaintStatus.Open;
        }

        public Complaint()
        {
        }
    }
}