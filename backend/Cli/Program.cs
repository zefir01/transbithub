using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.CommandLine;
using System.CommandLine.Builder;
using System.CommandLine.Invocation;
using System.CommandLine.Parsing;

namespace Cli
{
    // ReSharper disable once ClassNeverInstantiated.Global
    // ReSharper disable once ArrangeTypeModifiers
    class Program
    {
        static async Task<int> Main(params string[] args)
        {
            Cli cli = new Cli();
            await cli.Run(args);
            return 0;
        }
    }
}