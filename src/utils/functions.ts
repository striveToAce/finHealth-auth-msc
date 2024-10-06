
export const getExpirationDate = (duration: string) => {
    const now = new Date();
    const expiresAt = new Date(now);
  
    // Parse the duration string (e.g., "7d")
    const match = duration.match(/(\d+)([a-zA-Z])/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
  
      switch (unit) {
        case 'd':
          expiresAt.setDate(now.getDate() + value);
          break;
        case 'h':
          expiresAt.setHours(now.getHours() + value);
          break;
        case 'm':
          expiresAt.setMinutes(now.getMinutes() + value);
          break;
        case 's':
          expiresAt.setSeconds(now.getSeconds() + value);
          break;
        // Add other cases as needed
        default:
          throw new Error('Unsupported duration unit');
      }
    }
  
    return expiresAt;
  };