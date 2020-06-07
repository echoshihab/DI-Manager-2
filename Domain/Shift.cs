using System;

namespace Domain
{
    public class Shift
    {
        public Guid Id { get; set; } //generate client side
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string License { get; set; } //foreign key
        public string Location { get; set; } //foreign key
        public string Room { get; set; } //foreign key
        public string Technologist { get; set; }  //foreign key

    }
}