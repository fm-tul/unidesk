using System.Collections;
using System.Text;

namespace Unidesk.Services.Reports;

public class TemplateEngine
{
    private readonly Dictionary<string, object?> _variables = new();
    private readonly string StartSequence;
    private readonly string EndSequence;
    
    private bool _isInForLoop { get; set; }

    public TemplateEngine(string startSequence, string endSequence)
    {
        StartSequence = startSequence;
        EndSequence = endSequence;
    }

    public TemplateEngine() : this("$_", "_$") { }


    public TemplateEngine Use(string key, object? value)
    {
        if (_variables.ContainsKey(key))
        {
            _variables[key] = value;
        }
        else
        {
            _variables.Add(key, value);
        }

        return this;
    }

    public string Render(string template)
    {
        var result = template;
        foreach (var (key, value) in _variables)
        {
            // if value is iterable, then render each item
            if (value is ICollection collection)
            {
                var startCycle = StartSequence + "Start:" + key + EndSequence;
                var endCycle = StartSequence + "End:" + key + EndSequence;
                
                var startCycleIndex = result.IndexOf(startCycle, StringComparison.Ordinal);
                var endCycleIndex = result.IndexOf(endCycle, StringComparison.Ordinal);
                
                if (startCycleIndex == -1 || endCycleIndex == -1)
                {
                    continue;
                }

                if (_isInForLoop)
                {
                    continue;
                }

                var cycleTemplate = result[(startCycleIndex + startCycle.Length)..endCycleIndex].Trim();
                var cycleResult = new StringBuilder();
                
                _isInForLoop = true;
                foreach (var item in collection)
                {
                    var itemResult = Render(cycleTemplate);
                    itemResult = itemResult.Replace(StartSequence + key + EndSequence, item?.ToString() ?? string.Empty);
                    cycleResult.Append("\r\n");
                    cycleResult.Append(itemResult);
                }
                _isInForLoop = false;
                
                result = result.Remove(startCycleIndex, endCycleIndex - startCycleIndex + endCycle.Length);
                result = result.Insert(startCycleIndex, cycleResult.ToString().Trim());
            }
            else
            {
                var sequence = StartSequence + key + EndSequence;
                result = result.Replace(sequence, value?.ToString() ?? string.Empty);
            }

        }

        return result;
    }
}