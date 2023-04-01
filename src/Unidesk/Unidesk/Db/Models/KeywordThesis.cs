namespace Unidesk.Db.Models;

public class KeywordThesis
{
    public Guid ThesisId { get; set; }
    public Thesis Thesis { get; set; }

    public Guid KeywordId { get; set; }
    public Keyword Keyword { get; set; }

    public KeywordStatus Status { get; set; }


    protected bool Equals(KeywordThesis other)
    {
        return ThesisId.Equals(other.ThesisId) && KeywordId.Equals(other.KeywordId);
    }

    public override bool Equals(object? obj)
    {
        if (ReferenceEquals(null, obj))
        {
            return false;
        }

        if (ReferenceEquals(this, obj))
        {
            return true;
        }

        if (obj.GetType() != this.GetType())
        {
            return false;
        }

        return Equals((KeywordThesis)obj);
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(ThesisId, KeywordId);
    }
}