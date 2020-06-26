import {DefaultCrudRepository} from '@loopback/repository';

import {inject} from '@loopback/core';
import {AuditLog} from '../models/audit-log.model';
import {AuditdbDataSource} from '../../../datasources';

export class AuditLogRepository extends DefaultCrudRepository<
  AuditLog,
  typeof AuditLog.prototype.id
> {
  constructor(@inject('datasources.auditdb') dataSource: AuditdbDataSource) {
    super(AuditLog, dataSource);
  }
}
