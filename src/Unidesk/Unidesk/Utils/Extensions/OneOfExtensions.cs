namespace Unidesk.Utils.Extensions;

using OneOf;

public static class OneOfExtensions
{
    // for 2 types
    public static async Task<TResult> MatchAsync<TResult, T0, T1>(this Task<OneOf<T0, T1>> oneOf, Func<T0, TResult> f0, Func<T1, TResult> f1)
    {
        var result = await oneOf;
        return result.Match(f0, f1);
    }

    // for 3 types
    public static async Task<TResult> MatchAsync<TResult, T0, T1, T2>(this Task<OneOf<T0, T1, T2>> oneOf, Func<T0, TResult> f0, Func<T1, TResult> f1, Func<T2, TResult> f2)
    {
        var result = await oneOf;
        return result.Match(f0, f1, f2);
    }

    // for 4 types
    public static async Task<TResult> MatchAsync<TResult, T0, T1, T2, T3>(this Task<OneOf<T0, T1, T2, T3>> oneOf, Func<T0, TResult> f0, Func<T1, TResult> f1, Func<T2, TResult> f2,
        Func<T3, TResult> f3)
    {
        var result = await oneOf;
        return result.Match(f0, f1, f2, f3);
    }

    // for 5 types
    public static async Task<TResult> MatchAsync<TResult, T0, T1, T2, T3, T4>(this Task<OneOf<T0, T1, T2, T3, T4>> oneOf, Func<T0, TResult> f0, Func<T1, TResult> f1,
        Func<T2, TResult> f2, Func<T3, TResult> f3, Func<T4, TResult> f4)
    {
        var result = await oneOf;
        return result.Match(f0, f1, f2, f3, f4);
    }

    // for 6 types
    public static async Task<TResult> MatchAsync<TResult, T0, T1, T2, T3, T4, T5>(this Task<OneOf<T0, T1, T2, T3, T4, T5>> oneOf, Func<T0, TResult> f0, Func<T1, TResult> f1,
        Func<T2, TResult> f2, Func<T3, TResult> f3, Func<T4, TResult> f4, Func<T5, TResult> f5)
    {
        var result = await oneOf;
        return result.Match(f0, f1, f2, f3, f4, f5);
    }

    // for 7 types
    public static async Task<TResult> MatchAsync<TResult, T0, T1, T2, T3, T4, T5, T6>(this Task<OneOf<T0, T1, T2, T3, T4, T5, T6>> oneOf, Func<T0, TResult> f0,
        Func<T1, TResult> f1, Func<T2, TResult> f2, Func<T3, TResult> f3, Func<T4, TResult> f4, Func<T5, TResult> f5, Func<T6, TResult> f6)
    {
        var result = await oneOf;
        return result.Match(f0, f1, f2, f3, f4, f5, f6);
    }

    // for 8 types
    public static async Task<TResult> MatchAsync<TResult, T0, T1, T2, T3, T4, T5, T6, T7>(this Task<OneOf<T0, T1, T2, T3, T4, T5, T6, T7>> oneOf, Func<T0, TResult> f0,
        Func<T1, TResult> f1, Func<T2, TResult> f2, Func<T3, TResult> f3, Func<T4, TResult> f4, Func<T5, TResult> f5, Func<T6, TResult> f6, Func<T7, TResult> f7)
    {
        var result = await oneOf;
        return result.Match(f0, f1, f2, f3, f4, f5, f6, f7);
    }
}