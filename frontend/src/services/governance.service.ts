import { AuditLog, PlacementDrive } from '../domain/models';

export class GovernanceService {
    private logs: AuditLog[] = [];

    logAction(actor: string, action: string, targetId: string, metadata: any): void {
        const log: AuditLog = {
            id: `LOG_${Date.now()}`,
            timestamp: new Date().toISOString(),
            actor,
            action,
            targetId,
            metadata
        };
        this.logs.push(log);
        console.log(`[AUDIT] ${action} by ${actor} on ${targetId}`);
    }

    getAuditLogs(targetId?: string): AuditLog[] {
        return targetId ? this.logs.filter(l => l.targetId === targetId) : this.logs;
    }

    /**
     * Bind an application to the current drive version.
     */
    static getBindingVersion(drive: PlacementDrive): number {
        return drive.version;
    }

    /**
     * Checks if a drive can be modified.
     */
    static canModify(drive: PlacementDrive): boolean {
        return !drive.isFrozen;
    }
}
