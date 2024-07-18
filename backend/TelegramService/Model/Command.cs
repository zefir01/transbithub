namespace TelegramService.Model
{
    public interface ICommand
    {
        string Name { get; }
        int Id { get; }
    }

    public class Command: ICommand
    {
        public Command(string name, int id)
        {
            Name = name;
            Id = id;
        }

        public string Name { get; }
        public int Id { get; }
    }
    public class Command<T> : ICommand
    {
        public Command(string name, int id, T payload)
        {
            Name = name;
            Id = id;
            Payload = payload;
        }

        public string Name { get; }
        public int Id { get; }
        public T Payload { get; }
    }
}