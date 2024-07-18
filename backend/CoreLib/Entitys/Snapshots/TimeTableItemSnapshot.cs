using System.ComponentModel.DataAnnotations;

namespace CoreLib.Entitys.Snapshots
{
    public class TimeTableItemSnapshot
    {
        [Key]
        public long Key { get; private set; }
        public Days Day { get; private set; }
        public byte Start { get; private set; }
        public byte End { get; private set; }
    }
}