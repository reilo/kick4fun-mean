**Install MongoDB as service**

Install with the following options:

:Database files: `C:\ProgramData\MongoDB\db`

:Log files: `C:\ProgramData\MongoDB\log`

Create config file `C:\Program Files\MongoDB\mongod.cfg`
with content:

    systemLog:
        destination: file
        path: C:\ProgramData\MongoDB\log\mongod.log
    storage:
        dbPath: C:\ProgramData\MongoDB\db

Install service:

`"C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --config "C:\Program Files\MongoDB\mongod.cfg" --install`

Remove service:

`"C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --remove`

Start/Stop service:

`net start MongoDB / net stop MongoDB`

Install as bootable service:

`sc.exe create MongoDB binPath= "C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe --service --config=\"C:\Program Files\MongoDB\mongod.cfg\"" DisplayName= "MongoDB" start= "auto"`

Remove service

`sc.exe delete MongoDB`
