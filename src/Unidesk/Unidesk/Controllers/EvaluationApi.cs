using Microsoft.AspNetCore.Mvc;
using Unidesk.Client.ExtraTypes;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Security;
using Unidesk.Server;
using Unidesk.Server.ServiceFilters;
using Unidesk.Utils.Extensions;

namespace Unidesk.Controllers;

public static class EvaluationApi
{
    public static RouteGroupBuilder MapEvaluationApi(this RouteGroupBuilder evaluationApi)
    {
        evaluationApi.MapGet("/list/{id:guid}", async ([FromServices] EvaluationService service, Guid id, CancellationToken ct)
                => await service.GetAllAsync(id, ct))
           .WithName("GetAll")
           .Produces<List<EvaluationDto>>();

        evaluationApi.MapGet("/get/{id:guid}", async ([FromServices] EvaluationService service, Guid id, string? pass, CancellationToken ct)
                => await service.GetOneAsync(id, pass, ct))
           .WithName("GetOne")
           .AllowAnonymous()
           .Produces<EvaluationDetailDto>();

        evaluationApi.MapGet("/peek/{id:guid}", async ([FromServices] EvaluationService service, Guid id, CancellationToken ct)
                => await service.PeekAsync(id, ct))
           .WithName("Peek")
           .AllowAnonymous()
           .Produces<EvaluationPeekDto>();

        evaluationApi.MapGet("/reject/{id:guid}", async ([FromServices] EvaluationService service, Guid id, string pass, string? reason, CancellationToken ct)
                => await service.RejectAsync(id, pass, reason, ct))
           .WithName("Reject")
           .AllowAnonymous();

        evaluationApi.MapPost("/upsert", async ([FromServices] EvaluationService service, EvaluationDto dto, CancellationToken ct)
                => await service
                   .Upsert(dto, ct)
                   .MatchAsync(i => i, e => throw e)
            )
           .WithName("Upsert")
           .Produces<EvaluationPeekDto>()
           .RequireGrant(Grants.Action_ThesisEvaluation_Manage);

        evaluationApi.MapPost("/update-one", async ([FromServices] EvaluationService service, EvaluationDetailDto dto, string pass, CancellationToken ct)
                => await service
                   .UpdateOne(dto, pass, ct)
                   .MatchAsync(i => i, e => throw e)
            )
           .WithName("UpdateOne")
           .AllowAnonymous()
           .Produces<EvaluationDetailDto>();

        evaluationApi.MapPut("/change-status", async ([FromServices] EvaluationService service, Guid id, EvaluationStatus status, CancellationToken ct)
                => await service.ChangeStatus(id, status, null, ct))
           .WithName("ChangeStatus")
           .Produces<EvaluationDto>()
           .RequireGrant(Grants.Action_ThesisEvaluation_Manage);

        evaluationApi.MapPut("/change-status-pass", async ([FromServices] EvaluationService service, Guid id, EvaluationStatus status, string? pass, CancellationToken ct)
                => await service.ChangeStatus(id, status, pass, ct))
           .WithName("ChangeStatusWithPass")
           .AllowAnonymous()
           .Produces<EvaluationDto>();

        evaluationApi.MapGet("/pdf-preview", async ([FromServices] EvaluationService service, Guid id, string? pass, CancellationToken ct)
                =>
            {
                var bytes = await service.PdfPreviewAsync(id, pass, ct);
                return Results.Bytes(bytes, "application/pdf");
            })
           .WithName("GetPdfPreview")
           .AllowAnonymous()
           .Produces<IResult>();

        evaluationApi.MapDelete("/delete/{id:guid}", async ([FromServices] EvaluationService service, Guid id, CancellationToken ct)
                => await service.DeleteOne(id, ct))
           .WithName("DeleteOne")
           .RequireGrant(Grants.Action_ThesisEvaluation_Manage);

        // handle file upload
        evaluationApi.MapPost("upload-file-internship", async ([FromServices] EvaluationService service,
                    Guid evaluationId,
                    Guid internshipId,
                    IFormFile file, CancellationToken ct)
                => await service.UploadFileAsync(internshipId, evaluationId, file, ct))
           .WithName("UploadFileInternship")
           .RequireGrant(Grants.Action_ThesisEvaluation_Manage);
        
        evaluationApi.MapGet("download/file-internship", async ([FromServices] EvaluationService service,
                    Guid id, CancellationToken ct)
                =>
            {
                var document = await service.DownloadEvaluationFileAsync(id, ct);
                return Results.Bytes(document.DocumentContent.Content, document.ContentType, document.Name);
            })
           .WithName("DownloadFileInternship")
           .AllowAnonymous()
           .Produces<BlobWithName>();
        
        evaluationApi.MapDelete("remove/file-internship", async ([FromServices] EvaluationService service,
                    Guid id, CancellationToken ct)
                => await service.RemoveFileAsync(id, ct))
           .WithName("RemoveFileInternship")
           .RequireGrant(Grants.Action_ThesisEvaluation_Manage)
           .Produces<bool>();
        
        evaluationApi.MapGet("invite-supervisor", async ([FromServices] EvaluationService service, Guid internshipId, Guid evaluationId, CancellationToken ct)
                => await service.InviteSupervisorToInternshipAsync(internshipId, evaluationId, ct))
           .WithName("InviteSupervisorToInternship")
           .RequireGrant(Grants.Action_ThesisEvaluation_Manage)
           .Produces<bool>();

        return evaluationApi;
    }
}