﻿using System;

namespace EasyData
{
    public class EasyDataManagerException : Exception
    {
        public EasyDataManagerException(string message) : base(message)
        { }
    }

    public class RecordNotFoundException : EasyDataManagerException
    {
        public RecordNotFoundException(string entityContainer, string recordKey)
            : base($"Can't found the record with ID {recordKey} in {entityContainer}")
        { }
    }

    public class ContainerNotFoundException : EasyDataManagerException
    {
        public ContainerNotFoundException(string entityContainer) : base($"Container is not found: {entityContainer}")
        { }
    }
}
