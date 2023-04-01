using Unidesk.Db.Models.Internships;

namespace Unidesk.Db.Models;

public class KeywordInternship
{
    public Guid InternshipId { get; set; }
    public Internship Internship { get; set; }

    public Guid KeywordId { get; set; }
    public Keyword Keyword { get; set; }

    public KeywordStatus Status { get; set; }

    protected bool Equals(KeywordInternship other)
    {
        return InternshipId.Equals(other.InternshipId) && KeywordId.Equals(other.KeywordId);
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
        return HashCode.Combine(InternshipId, KeywordId);
    }
}