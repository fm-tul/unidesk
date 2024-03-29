﻿using Unidesk.Db.Models;
using Unidesk.Db.Models.Internships;
using Unidesk.Locales;

namespace Unidesk.Reports;

public class ThesisEvaluationContext
{
    public required Thesis? Thesis { get; set; }
    public Internship? Internship { get; set; }
    
    public required Language Language { get; set; }
    public required User? Evaluator { get; set; }
    public required UserFunction UserFunction { get; set; }
    public required Evaluation Evaluation { get; set; }
    public User CurrentUser { get; set; }
}