import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import util = require('../DotnetMockHelper');

const taskPath = path.join(__dirname, '../..', 'dotnetcore.js');
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
const nmh: util.DotnetMockHelper = new util.DotnetMockHelper(tmr);

nmh.setNugetVersionInputDefault();
tmr.setInput('command', 'test');
tmr.setInput('projects', 'temp.csproj');
tmr.setInput('BuildConfiguration', 'config');
tmr.setInput('BuildPlatform', 'x86');
tmr.setInput('publishTestResults', 'true');

const a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    'osType': {},
    'checkPath': {
        'c:\\agent\\home\\directory\\temp.csproj': true,
        'c:\\path\\dotnet.exe': true
    },
    'which': {
        'dotnet': 'c:\\path\\dotnet.exe'
    },
    'exec': {
        'c:\\path\\dotnet.exe test c:\\agent\\home\\directory\\temp.csproj --logger trx --results-directory c:\\agent\\home\\temp': {
            'code': 1,
            'stdout': '',
            'stderr': 'dotnet error'
        }
    },
    'exist': {
        'D:\\src\\github\\vsts-tasks\\Tests\\Nuget': true
    },
    'stats': {
        'c:\\agent\\home\\directory\\temp.csproj': {
            'isFile': true
        }
    },
    'findMatch': {
        'temp.csproj': ['c:\\agent\\home\\directory\\temp.csproj'],
        '**/*.trx': ['c:\\agent\\home\\temp\\sample.trx']
    }
};
nmh.setAnswers(a);
nmh.registerNugetUtilityMock(['c:\\agent\\home\\directory\\temp.csproj']);
nmh.registerDefaultNugetVersionMock();
nmh.registerToolRunnerMock();
nmh.registerNugetConfigMock();
tmr.run();
