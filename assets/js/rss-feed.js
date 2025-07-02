// RSS Feed Integration for Wacky Fun Magazine
// Fetches blog posts from blog.wackyfunmagazine.com/feed.xml and displays them

class RSSFeedLoader {
  constructor() {
    this.feedUrl = 'https://blog.wackyfunmagazine.com/feed.xml';
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
      const items = xmlDoc.querySelectorAll('item');
      
      if (items.length === 0) {
        this.showFallbackContent();
        return;
      }

      const blogContainer = document.querySelector('.blog-feed .blog-item:first-child').parentNode;
      
      // Clear existing blog items but keep the header
      const existingItems = blogContainer.querySelectorAll('.blog-item');
      existingItems.forEach(item => item.remove());
      
      // Remove the "View All Posts" button temporarily
      const viewAllBtn = blogContainer.querySelector('.btn');
      if (viewAllBtn) {
        viewAllBtn.parentNode.remove();
      }

      // Process and display the RSS items
      Array.from(items).slice(0, this.maxPosts).forEach((item, index) => {
        const title = this.getTextContent(item, 'title');
        const link = this.getTextContent(item, 'link');
        const description = this.getTextContent(item, 'description');
        const pubDate = this.getTextContent(item, 'pubDate');
        
        const blogItemElement = this.createBlogItem(title, link, description, pubDate, index === 0);
        blogContainer.appendChild(blogItemElement);
      });

      // Re-add the "View All Posts" button
      const viewAllContainer = document.createElement('div');
      viewAllContainer.style.cssText = 'text-align: center; margin-top: 1rem;';
      viewAllContainer.innerHTML = '<a href="https://blog.wackyfunmagazine.com" class="btn btn-primary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">View All Posts</a>';
      blogContainer.appendChild(viewAllContainer);

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