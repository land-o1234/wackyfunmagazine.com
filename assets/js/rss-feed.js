// RSS Feed Integration for Wacky Fun Magazine
// Fetches blog posts from blog.wackyfunmagazine.com/feed.xml and displays them

class RSSFeedLoader {
  constructor() {
    // This will work for both current setup and future WordPress
    this.feedUrl = 'https://blog.wackyfunmagazine.com/feed'; // WordPress uses /feed by default
    this.fallbackUrl = 'https://blog.wackyfunmagazine.com/feed.xml'; // Current Jekyll feed
    
    // Use multiple CORS proxies as fallbacks
    this.corsProxies = [
      'https://api.allorigins.win/get?url=',
      'https://api.codetabs.com/v1/proxy?quest=',
      'https://thingproxy.freeboard.io/fetch/'
    ];
    this.maxPosts = 3;
  }

  async loadFeed() {
    console.log('Loading RSS feed...');
    
    // Try both WordPress and Jekyll feed URLs
    const feedUrls = [this.feedUrl, this.fallbackUrl];
    
    for (const url of feedUrls) {
      // Try direct access first
      if (await this.tryDirectAccess(url)) {
        return;
      }
      
      // Try each CORS proxy
      for (const proxy of this.corsProxies) {
        if (await this.tryProxyAccess(proxy, url)) {
          return;
        }
      }
    }
    
    // If all methods fail, show fallback
    console.warn('All RSS feed methods failed');
    this.showFallbackContent();
  }

  async tryDirectAccess(url) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const xmlText = await response.text();
        this.parseFeed(xmlText);
        console.log('✅ Direct RSS access successful:', url);
        return true;
      }
    } catch (error) {
      console.log('❌ Direct access failed for:', url);
    }
    return false;
  }

  async tryProxyAccess(proxy, url) {
    try {
      let response;
      let xmlText;
      
      if (proxy.includes('allorigins.win')) {
        // AllOrigins returns JSON with contents
        response = await fetch(`${proxy}${encodeURIComponent(url)}`);
        const data = await response.json();
        xmlText = data.contents;
      } else {
        // Other proxies return the content directly
        response = await fetch(`${proxy}${encodeURIComponent(url)}`);
        xmlText = await response.text();
      }
      
      if (xmlText && xmlText.includes('<rss') || xmlText.includes('<?xml')) {
        this.parseFeed(xmlText);
        console.log('✅ Proxy RSS access successful:', proxy, url);
        return true;
      }
    } catch (error) {
      console.log('❌ Proxy access failed:', proxy, url);
    }
    return false;
  }

  parseFeed(xmlString) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('XML parsing error');
      }
      
      // Try both RSS (item) and Atom (entry) formats
      let items = xmlDoc.querySelectorAll('item');
      if (items.length === 0) {
        items = xmlDoc.querySelectorAll('entry'); // Atom feed format
      }
      
      if (items.length === 0) {
        console.warn('No RSS/Atom items found');
        this.showFallbackContent();
        return;
      }

      const blogContainer = document.getElementById('blog-content');
      
      if (!blogContainer) {
        console.warn('Blog content container not found');
        return;
      }
      
      // Clear existing content
      blogContainer.innerHTML = '';

      // Process and display the feed items
      Array.from(items).slice(0, this.maxPosts).forEach((item, index) => {
        const title = this.getTextContent(item, 'title');
        
        // For Atom feeds, links are in a different format
        let link = this.getTextContent(item, 'link');
        if (!link) {
          const linkElement = item.querySelector('link[rel="alternate"]');
          link = linkElement ? linkElement.getAttribute('href') : '';
        }
        
        // Try different description fields (Atom uses summary, RSS uses description)
        let description = this.getTextContent(item, 'description') || 
                         this.getTextContent(item, 'summary') ||
                         this.getTextContent(item, 'content');
        
        // Clean up CDATA and HTML tags from description
        description = description.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
                                .replace(/<[^>]*>/g, '')
                                .trim();
        
        // Try different date fields
        const pubDate = this.getTextContent(item, 'pubDate') || 
                       this.getTextContent(item, 'published') ||
                       this.getTextContent(item, 'updated');
        
        const blogItemElement = this.createBlogItem(title, link, description, pubDate, index === 0);
        blogContainer.appendChild(blogItemElement);
      });

      // Add the "View All Posts" button
      const viewAllContainer = document.createElement('div');
      viewAllContainer.style.cssText = 'text-align: center; margin-top: 1rem;';
      viewAllContainer.innerHTML = '<a href="https://blog.wackyfunmagazine.com" class="btn btn-primary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">View All Posts</a>';
      blogContainer.appendChild(viewAllContainer);

      console.log('✅ RSS feed loaded successfully with', items.length, 'posts');

    } catch (error) {
      console.warn('Error parsing RSS feed:', error);
      this.showFallbackContent();
    }
  }

  getTextContent(item, tagName) {
    const element = item.querySelector(tagName);
    return element ? element.textContent.trim() : '';
  }

  createBlogItem(title, link, description, pubDate, isNew = false) {
    const blogItem = document.createElement('div');
    blogItem.className = 'blog-item';
    
    // Format the date
    const formattedDate = this.formatDate(pubDate);
    
    // Truncate description if too long
    const truncatedDescription = description.length > 120 
      ? description.substring(0, 120) + '...' 
      : description;

    blogItem.innerHTML = `
      <a href="${link}" class="blog-title" target="_blank" rel="noopener noreferrer">
        ${title} ${isNew ? '<span class="new-indicator">NEW</span>' : ''}
      </a>
      <p class="blog-excerpt">${truncatedDescription}</p>
      <span class="blog-date">${formattedDate}</span>
    `;

    return blogItem;
  }

  formatDate(pubDate) {
    try {
      const date = new Date(pubDate);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return '1 day ago';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else if (diffDays < 14) {
        return '1 week ago';
      } else if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)} weeks ago`;
      } else if (diffDays < 60) {
        return '1 month ago';
      } else {
        return `${Math.floor(diffDays / 30)} months ago`;
      }
    } catch (error) {
      return 'Recently';
    }
  }

  showFallbackContent() {
    console.info('Using fallback blog content - RSS feed unavailable');
    
    const blogContainer = document.getElementById('blog-content');
    if (blogContainer && blogContainer.children.length === 0) {
      // Only add fallback if container is empty
      blogContainer.innerHTML = `
        <div class="blog-item">
          <a href="https://blog.wackyfunmagazine.com" class="blog-title" target="_blank">
            Visit Our Blog for Latest Updates <span class="new-indicator">NEW</span>
          </a>
          <p class="blog-excerpt">Check out our latest posts about magazine creation, reader features, and behind-the-scenes content...</p>
          <span class="blog-date">Updated regularly</span>
        </div>
        
        <div style="text-align: center; margin-top: 1rem;">
          <a href="https://blog.wackyfunmagazine.com" class="btn btn-primary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">Visit Blog</a>
        </div>
        
        <div style="font-size: 0.75rem; color: var(--text-light); text-align: center; margin-top: 1rem; opacity: 0.7;">
          📡 Live blog updates temporarily unavailable
        </div>
      `;
    }
  }
}

// Initialize RSS feed loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Only load RSS feed on the home page where blog feed exists
  if (document.querySelector('.blog-feed')) {
    const rssLoader = new RSSFeedLoader();
    rssLoader.loadFeed();
  }
});