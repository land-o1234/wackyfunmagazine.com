// RSS Feed Integration for Wacky Fun Magazine
// Fetches blog posts from blog.wackyfunmagazine.com/feed.xml and displays them

class RSSFeedLoader {
  constructor() {
    this.feedUrl = 'https://blog.wackyfunmagazine.com/feed';
    this.corsProxy = 'https://api.allorigins.win/get?url=';
    this.maxPosts = 3;
  }

  async loadFeed() {
    try {
      // Use CORS proxy to fetch the RSS feed
      const response = await fetch(`${this.corsProxy}${encodeURIComponent(this.feedUrl)}`);
      const data = await response.json();
      
      if (data.contents) {
        this.parseFeed(data.contents);
      } else {
        this.showFallbackContent();
      }
    } catch (error) {
      console.warn('Unable to load RSS feed:', error);
      this.showFallbackContent();
    }
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
    // Keep the existing placeholder content if RSS fails to load
    console.info('Using fallback blog content - RSS feed unavailable');
    
    // Optionally add a subtle indicator that this is fallback content
    const blogContainer = document.getElementById('blog-content');
    if (blogContainer) {
      // Add a small note about RSS being unavailable, but make it subtle
      const fallbackNote = document.createElement('div');
      fallbackNote.style.cssText = 'font-size: 0.75rem; color: var(--text-light); text-align: center; margin-top: 1rem; opacity: 0.7;';
      fallbackNote.innerHTML = '📡 Live blog updates temporarily unavailable';
      
      // Insert before the "View All Posts" button if it exists
      const viewAllBtn = blogContainer.querySelector('.btn');
      if (viewAllBtn && viewAllBtn.parentNode) {
        viewAllBtn.parentNode.insertBefore(fallbackNote, viewAllBtn.parentNode);
      } else {
        blogContainer.appendChild(fallbackNote);
      }
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