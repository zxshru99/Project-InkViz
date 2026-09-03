import { Template } from './template.model';

export const listTemplates = async () => {
  return await Template.find({ isActive: true }).select('-htmlContent').lean();
};
