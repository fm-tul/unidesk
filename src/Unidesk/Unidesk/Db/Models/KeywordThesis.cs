namespace Unidesk.Db.Models;

public class KeywordThesis
{
 
    public Guid ThesisId { get; set; }
    public Thesis Thesis { get; set; }
    
    public Guid KeywordId { get; set; }
    public Keyword Keyword { get; set; }
    
    public KeywordThesisStatus Status { get; set; }
}

public enum KeywordThesisStatus
{
    Official,
    Suggested,
    Rejected
}