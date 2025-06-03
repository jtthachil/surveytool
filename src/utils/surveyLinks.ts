// Utility functions for managing survey links and customer IDs

export interface SurveyLinkData {
  baseUrl: string;
  customerId: string;
  participantId: string;
  studyId: string;
  uniqueLink: string;
}

/**
 * Generate a unique customer ID for tracking purposes
 */
export const generateCustomerId = (participantId: string, studyId: string): string => {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 8);
  const participantPrefix = participantId.substring(0, 3).toUpperCase();
  const studyPrefix = studyId.substring(studyId.length - 3).toUpperCase();
  
  return `${participantPrefix}${studyPrefix}${timestamp}${randomString}`.toUpperCase();
};

/**
 * Generate a unique survey link with customer ID tracking
 */
export const generateUniqueLink = (
  baseUrl: string,
  participantId: string,
  studyId: string,
  customerId?: string
): SurveyLinkData => {
  const generatedCustomerId = customerId || generateCustomerId(participantId, studyId);
  
  // Clean the base URL and ensure it doesn't end with slash
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  
  // Create URL with parameters
  const url = new URL(cleanBaseUrl);
  url.searchParams.set('customer_id', generatedCustomerId);
  url.searchParams.set('participant_id', participantId);
  url.searchParams.set('study_id', studyId);
  url.searchParams.set('source', 'survey_platform');
  url.searchParams.set('timestamp', Date.now().toString());
  
  return {
    baseUrl: cleanBaseUrl,
    customerId: generatedCustomerId,
    participantId,
    studyId,
    uniqueLink: url.toString()
  };
};

/**
 * Generate unique links for multiple participants
 */
export const generateBulkLinks = (
  baseUrl: string,
  participants: Array<{ id: string; name: string; email: string }>,
  studyId: string
): Array<SurveyLinkData & { participantName: string; participantEmail: string }> => {
  return participants.map(participant => ({
    ...generateUniqueLink(baseUrl, participant.id, studyId),
    participantName: participant.name,
    participantEmail: participant.email
  }));
};

/**
 * Validate if a survey link contains required tracking parameters
 */
export const validateSurveyLink = (url: string): {
  isValid: boolean;
  missingParams: string[];
  extractedData?: {
    customerId: string;
    participantId: string;
    studyId: string;
  };
} => {
  try {
    const urlObj = new URL(url);
    const requiredParams = ['customer_id', 'participant_id', 'study_id'];
    const missingParams: string[] = [];
    
    requiredParams.forEach(param => {
      if (!urlObj.searchParams.has(param)) {
        missingParams.push(param);
      }
    });
    
    if (missingParams.length === 0) {
      return {
        isValid: true,
        missingParams: [],
        extractedData: {
          customerId: urlObj.searchParams.get('customer_id')!,
          participantId: urlObj.searchParams.get('participant_id')!,
          studyId: urlObj.searchParams.get('study_id')!,
        }
      };
    } else {
      return {
        isValid: false,
        missingParams
      };
    }
  } catch (error) {
    return {
      isValid: false,
      missingParams: ['Invalid URL format']
    };
  }
};

/**
 * Extract customer ID from a survey response or completion event
 */
export const extractCustomerIdFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('customer_id');
  } catch (error) {
    return null;
  }
};

/**
 * Generate exit links with customer ID tracking
 */
export const generateExitLinks = (
  studyId: string,
  customerId: string,
  participantId: string
) => {
  const baseRedirectUrl = 'https://research.yourplatform.com/redirect';
  
  const createExitUrl = (type: 'complete' | 'terminate' | 'quota-full') => {
    const url = new URL(`${baseRedirectUrl}/${type}`);
    url.searchParams.set('customer_id', customerId);
    url.searchParams.set('participant_id', participantId);
    url.searchParams.set('study_id', studyId);
    url.searchParams.set('exit_type', type);
    url.searchParams.set('timestamp', Date.now().toString());
    
    return url.toString();
  };
  
  return {
    complete: createExitUrl('complete'),
    terminate: createExitUrl('terminate'),
    quotaFull: createExitUrl('quota-full')
  };
};

/**
 * Format customer ID for display (adds hyphens for readability)
 */
export const formatCustomerId = (customerId: string): string => {
  if (customerId.length >= 8) {
    return `${customerId.substring(0, 4)}-${customerId.substring(4, 8)}-${customerId.substring(8)}`;
  }
  return customerId;
};

/**
 * Generate a CSV export of participant links
 */
export const generateParticipantLinksCSV = (
  linkData: Array<SurveyLinkData & { participantName: string; participantEmail: string }>
): string => {
  const headers = [
    'Participant Name',
    'Email',
    'Customer ID',
    'Participant ID', 
    'Study ID',
    'Unique Survey Link',
    'Generated At'
  ];
  
  const rows = linkData.map(data => [
    `"${data.participantName}"`,
    data.participantEmail,
    data.customerId,
    data.participantId,
    data.studyId,
    `"${data.uniqueLink}"`,
    new Date().toISOString()
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}; 