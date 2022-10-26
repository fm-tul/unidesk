namespace Unidesk.Utils;

public class DirectoryUtils
{
    public class DirectoryFreeze : IDisposable
    {
        public DirectoryFreeze(string directory)
        {
            _directory = directory;
            _files = Directory.GetFiles(directory).Select(i => new FileInfo(i)).ToList();
        }

        public void Dispose()
        {
            var files = Directory.GetFiles(_directory).Select(i => new FileInfo(i)).ToList();
            _newFiles = files
               .Where(i => _files.All(j => j.FullName != i.FullName))
               .ToList();
        }

        private readonly string _directory;
        private readonly List<FileInfo> _files;
        private List<FileInfo> _newFiles = new();

        public List<FileInfo> NewFiles => _newFiles;
    }

    public static DirectoryFreeze Freeze(string path)
    {
        return new DirectoryFreeze(path);
    }
}