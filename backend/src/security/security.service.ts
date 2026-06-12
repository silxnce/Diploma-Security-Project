import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SecurityEvent } from './entities/security-event.entity';

type CreateSecurityEventData = {
  type: string;
  ip: string;
  method: string;
  url: string;
  userAgent?: string;
  payload?: string;
  blocked?: boolean;
};

@Injectable()
export class SecurityService {
  constructor(
    @InjectRepository(SecurityEvent)
    private readonly securityEventRepository: Repository<SecurityEvent>,
  ) {}

  async logFailedLogin(ip: string, email: string, userAgent?: string) {
    return this.createEvent({
      type: 'FAILED_LOGIN',
      ip,
      method: 'POST',
      url: '/auth/login',
      userAgent,
      payload: JSON.stringify({ email }),
      blocked: false,
    });
  }

  async logSuspiciousRequest(data: {
    ip: string;
    method: string;
    url: string;
    userAgent?: string;
    payload?: string;
  }) {
    return this.createEvent({
      type: 'SUSPICIOUS_REQUEST_BLOCKED',
      ip: data.ip,
      method: data.method,
      url: data.url,
      userAgent: data.userAgent,
      payload: data.payload,
      blocked: true,
    });
  }

  async logDangerousActivity(data: {
    ip: string;
    method: string;
    url: string;
    userAgent?: string;
    payload?: string;
  }) {
    return this.createEvent({
      type: 'DANGEROUS_ACTIVITY_DETECTED',
      ip: data.ip,
      method: data.method,
      url: data.url,
      userAgent: data.userAgent,
      payload: data.payload,
      blocked: false,
    });
  }

  async logAdminAccess(data: {
    ip: string;
    method: string;
    url: string;
    userAgent?: string;
    payload?: string;
  }) {
    return this.createEvent({
      type: 'ADMIN_RESOURCE_ACCESS',
      ip: data.ip,
      method: data.method,
      url: data.url,
      userAgent: data.userAgent,
      payload: data.payload,
      blocked: false,
    });
  }

  async createEvent(data: CreateSecurityEventData) {
    const event = this.securityEventRepository.create({
      type: data.type,
      ip: data.ip,
      method: data.method,
      url: data.url,
      userAgent: data.userAgent,
      payload: data.payload,
      blocked: data.blocked ?? false,
    });

    return this.securityEventRepository.save(event);
  }

  findAll() {
    return this.securityEventRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: number) {
    const event = await this.securityEventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Security event not found');
    }

    return event;
  }
}
