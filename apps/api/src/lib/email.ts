export interface EmailTemplateVars { [key: string]: string }

export const EMAIL_TEMPLATES: Record<string, { subject: (vars: EmailTemplateVars) => string; body: (vars: EmailTemplateVars) => string }> = {
  welcome: {
    subject: (vars) => `Welcome to SkillPage, ${vars.displayName}!`,
    body: (vars) => `<h1>Welcome to SkillPage!</h1><p>Hi ${vars.displayName},</p><p>Your account has been created. Start building your SkillPage at <a href="${vars.profileUrl}">${vars.profileUrl}</a></p><p>Best, The SkillPage Team</p>`,
  },
  'verify-email': {
    subject: () => 'Verify your email',
    body: (vars) => `<h1>Verify your email</h1><p>Click <a href="${vars.verifyUrl}">here</a> to verify your email. Token: ${vars.verificationToken}</p>`,
  },
  'proposal-received': {
    subject: (vars) => `New proposal for ${vars.jobTitle}`,
    body: (vars) => `<h1>New Proposal</h1><p>${vars.sellerName} has submitted a proposal for your job "${vars.jobTitle}".</p>`,
  },
  'milestone-funded': {
    subject: (vars) => `Milestone funded: ${vars.milestoneTitle}`,
    body: (vars) => `<h1>Milestone Funded</h1><p>The milestone "${vars.milestoneTitle}" for project "${vars.projectTitle}" has been funded. You can now start work.</p>`,
  },
  'milestone-delivered': {
    subject: (vars) => `Milestone delivered: ${vars.milestoneTitle}`,
    body: (vars) => `<h1>Delivery Ready</h1><p>The milestone "${vars.milestoneTitle}" has been delivered. <a href="${vars.deliverableUrl}">Review deliverable</a>.</p>`,
  },
  'dispute-opened': {
    subject: (vars) => `Dispute opened: ${vars.milestoneTitle}`,
    body: (vars) => `<h1>Dispute Opened</h1><p>A dispute has been opened for milestone "${vars.milestoneTitle}" (Case: ${vars.disputeId}). Our team will review shortly.</p>`,
  },
  'admin-dispute-assigned': {
    subject: (vars) => `Dispute assigned: ${vars.disputeId}`,
    body: (vars) => `<h1>Dispute Assigned</h1><p>Case ${vars.disputeId} has been assigned to you for resolution.</p>`,
  },
};

export async function sendEmail(env: any, to: string, templateName: string, vars: EmailTemplateVars) {
  const template = EMAIL_TEMPLATES[templateName];
  if (!template) throw new Error(`Email template ${templateName} not found`);
  const message = { from: 'SkillPage <noreply@skillpage.io>', to, subject: template.subject(vars), html: template.body(vars) };
  console.log('Email queued:', message);
}
