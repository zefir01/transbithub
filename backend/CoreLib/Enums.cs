namespace CoreLib
{
    public enum SourceType
    {
        Grpc,
        Telegram,
        Service,
        Jira
    }
    public enum SecretOperations
    {
        ToUp,
        ToDown,
        ToTop,
        ToBottom,
        Remove
    }
}