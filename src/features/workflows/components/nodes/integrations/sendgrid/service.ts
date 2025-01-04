import axios from 'axios';

export interface SendGridConfig {
  emailType: 'body' | 'template';
  apiKey: string;
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
}

export class SendGridService {
  static readonly API_ENDPOINT = 'https://flownodes.onrender.com/api/nodes/sendgrid/send';

  static validateConfig(config: SendGridConfig): string | null {
    if (!config.apiKey) return 'API key is required';
    if (!config.to) return 'Recipient (to) is required';
    if (!config.from) return 'Sender (from) is required';
    if (!config.subject) return 'Subject is required';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(config.to)) return 'Invalid recipient email format';
    if (!emailRegex.test(config.from)) return 'Invalid sender email format';
    
    if (config.emailType === 'body') {
      if (!config.text && !config.html) {
        return 'Either text or HTML content is required for body emails';
      }
    } else if (config.emailType === 'template') {
      if (!config.templateId) {
        return 'Template ID is required for template emails';
      }
    }

    return null;
  }

  static async testEmail(config: SendGridConfig): Promise<{ success: boolean; message: string }> {
    try {
      console.log('SendGridService.testEmail: Starting test with config:', {
        ...config,
        apiKey: '***' // Hide API key in logs
      });

      // Validate configuration
      const validationError = this.validateConfig(config);
      if (validationError) {
        console.log('SendGridService.testEmail: Validation failed:', validationError);
        return {
          success: false,
          message: validationError
        };
      }

      // Prepare request payload
      const payload = {
        emailType: config.emailType,
        apiKey: config.apiKey,
        to: config.to,
        from: config.from,
        subject: config.subject,
        ...(config.emailType === 'body' ? {
          text: config.text,
          html: config.html
        } : {
          templateId: config.templateId,
          dynamicTemplateData: config.dynamicTemplateData
        })
      };

      console.log('SendGridService.testEmail: Sending request with payload:', {
        ...payload,
        apiKey: '***' // Hide API key in logs
      });

      // Make the API request
      const response = await axios.post(this.API_ENDPOINT, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('SendGridService.testEmail: Received response:', response.data);

      return {
        success: true,
        message: 'Email sent successfully'
      };
    } catch (error) {
      console.error('SendGridService.testEmail: Error occurred:', error);
      
      let errorMessage = 'Failed to send email';
      
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const responseData = error.response?.data;
        
        console.error('SendGridService.testEmail: API Error details:', {
          statusCode,
          responseData,
          message: error.message
        });

        errorMessage = responseData?.message || error.message;
        
        if (statusCode === 401) {
          errorMessage = 'Invalid API key';
        } else if (statusCode === 400) {
          errorMessage = `Invalid request: ${responseData?.message || 'Please check your input'}`;
        }
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }
}