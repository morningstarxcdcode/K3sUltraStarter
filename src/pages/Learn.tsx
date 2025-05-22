import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { Tutorial } from '../types';

const tutorials: Tutorial[] = [
  {
    id: 'what-is-ipfs',
    title: 'What is IPFS?',
    description: 'An introduction to the InterPlanetary File System and how it works.',
    content: `
      <h3>Understanding IPFS: The InterPlanetary File System</h3>
      
      <p>IPFS (InterPlanetary File System) is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. It addresses content by what it is, not where it is located.</p>
      
      <h4>Key Concepts:</h4>
      
      <ul>
        <li><strong>Content Addressing</strong>: Files in IPFS are identified by their content, not by their location. This is done using a Content Identifier (CID), which is a cryptographic hash of the file's contents.</li>
        <li><strong>Distributed System</strong>: Unlike traditional HTTP, which is location-based, IPFS distributes content across a network of nodes, making it more resilient and efficient.</li>
        <li><strong>Deduplication</strong>: Since files are identified by their content, identical files are only stored once on the network, saving storage space.</li>
        <li><strong>Offline-First</strong>: IPFS can work offline or in low-connectivity environments, making it ideal for areas with limited internet access.</li>
      </ul>
      
      <h4>How IPFS Works:</h4>
      
      <ol>
        <li>When you add a file to IPFS, the content is hashed to generate a unique CID.</li>
        <li>The file is split into smaller blocks, which are also hashed and linked together.</li>
        <li>These blocks are distributed across the IPFS network to nodes that request them or have agreed to store them (pinning).</li>
        <li>When someone wants to retrieve the file, they request it by its CID.</li>
        <li>IPFS finds the nodes that have the content and retrieves it, potentially from multiple sources simultaneously.</li>
      </ol>
      
      <p>IPFS represents a fundamental shift in how we think about and interact with content on the internet, moving away from location-based addressing to content-based addressing.</p>
    `,
    level: 'beginner',
  },
  {
    id: 'content-addressing',
    title: 'Content Addressing in IPFS',
    description: 'Learn how IPFS identifies and locates content across the network.',
    content: `
      <h3>Content Addressing: The Foundation of IPFS</h3>
      
      <p>Content addressing is a key concept in IPFS that fundamentally changes how we reference and locate data. Instead of pointing to where content is stored (like with URLs), IPFS addresses what the content is.</p>
      
      <h4>How Content Addressing Works:</h4>
      
      <ol>
        <li><strong>Hashing</strong>: When you add a file to IPFS, it computes a cryptographic hash (using SHA-256) of the file's contents.</li>
        <li><strong>CID Generation</strong>: This hash becomes part of the Content Identifier (CID), which uniquely identifies the file on the network.</li>
        <li><strong>Immutability</strong>: If the content changes even slightly, the hash will be completely different, resulting in a new CID.</li>
      </ol>
      
      <h4>Benefits of Content Addressing:</h4>
      
      <ul>
        <li><strong>Verifiability</strong>: You can verify you received exactly the content you requested by recalculating the hash.</li>
        <li><strong>Deduplication</strong>: Identical content has the same CID, so it's only stored once on the network.</li>
        <li><strong>Content Persistence</strong>: Content can move locations without breaking links, as long as it's somewhere on the IPFS network.</li>
        <li><strong>Censorship Resistance</strong>: It's difficult to censor content when it's identified by what it is rather than where it's located.</li>
      </ul>
      
      <h4>Understanding CIDs:</h4>
      
      <p>A CID looks something like: <code>QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco</code></p>
      
      <p>Modern CIDs (v1) include:</p>
      <ul>
        <li>The hash function used (e.g., sha2-256)</li>
        <li>The encoding format (e.g., base32, base58)</li>
        <li>The content type (e.g., dag-pb for IPFS objects)</li>
        <li>The actual hash value</li>
      </ul>
      
      <p>Content addressing enables many of IPFS's most powerful features and represents a fundamental shift in how we think about data on the internet.</p>
    `,
    level: 'intermediate',
  },
  {
    id: 'pinning-explained',
    title: 'Pinning in IPFS',
    description: 'Understanding how to make content persistent on the IPFS network.',
    content: `
      <h3>Pinning: Ensuring Content Persistence in IPFS</h3>
      
      <p>Pinning is a crucial concept in IPFS that helps ensure your content remains available on the network. Without pinning, content may be removed during garbage collection, particularly on public IPFS nodes.</p>
      
      <h4>Why Pinning Matters:</h4>
      
      <p>By default, IPFS nodes cache content they access temporarily. Over time, as more content is added, older, unused content may be removed to free up space. Pinning prevents this removal, making sure your important content stays available.</p>
      
      <h4>Types of Pins:</h4>
      
      <ul>
        <li><strong>Direct Pin</strong>: Pins the specific content by its CID.</li>
        <li><strong>Recursive Pin</strong>: Pins the content and all of its linked descendants (default when pinning).</li>
        <li><strong>Indirect Pin</strong>: Content that is pinned because it's part of a recursively pinned structure.</li>
      </ul>
      
      <h4>Pinning Strategies:</h4>
      
      <ol>
        <li><strong>Local Pinning</strong>: Pinning content on your own IPFS node.</li>
        <li><strong>Remote Pinning</strong>: Using a pinning service to store your content.</li>
        <li><strong>Distributed Pinning</strong>: Having multiple nodes pin your content for redundancy.</li>
      </ol>
      
      <h4>Pinning Services:</h4>
      
      <p>Several services offer IPFS pinning, allowing you to persist your content without running your own node:</p>
      <ul>
        <li>Pinata</li>
        <li>Infura</li>
        <li>Fleek</li>
        <li>Crust Network</li>
      </ul>
      
      <h4>Best Practices:</h4>
      
      <ul>
        <li>Pin important content on multiple nodes or services</li>
        <li>Regularly verify that your pinned content is still accessible</li>
        <li>Be mindful of storage limitations when pinning large files</li>
        <li>Use recursive pinning for content with internal links</li>
      </ul>
      
      <p>Remember: Without pinning, there's no guarantee your content will remain available on the IPFS network over time.</p>
    `,
    level: 'beginner',
  },
  {
    id: 'ipfs-vs-http',
    title: 'IPFS vs. Traditional HTTP',
    description: 'Compare and contrast IPFS with traditional web protocols.',
    content: `
      <h3>IPFS vs. HTTP: A Comparison of Web Protocols</h3>
      
      <p>IPFS and HTTP represent fundamentally different approaches to distributing and accessing content on the web. Understanding these differences helps appreciate the unique capabilities of each protocol.</p>
      
      <h4>Key Differences:</h4>
      
      <table>
        <tr>
          <th>Feature</th>
          <th>HTTP</th>
          <th>IPFS</th>
        </tr>
        <tr>
          <td>Addressing</td>
          <td>Location-based (URLs point to servers)</td>
          <td>Content-based (CIDs point to content itself)</td>
        </tr>
        <tr>
          <td>Architecture</td>
          <td>Client-server</td>
          <td>Peer-to-peer</td>
        </tr>
        <tr>
          <td>Content Distribution</td>
          <td>Single source (plus CDNs)</td>
          <td>Multiple sources simultaneously</td>
        </tr>
        <tr>
          <td>Offline Access</td>
          <td>Limited (requires specific caching)</td>
          <td>Built-in (content-addressing enables offline-first)</td>
        </tr>
        <tr>
          <td>Bandwidth Usage</td>
          <td>Can be inefficient (duplicate downloads)</td>
          <td>More efficient (deduplication, peer sharing)</td>
        </tr>
        <tr>
          <td>Content Verification</td>
          <td>Requires additional mechanisms (checksums)</td>
          <td>Built-in (content hashing)</td>
        </tr>
        <tr>
          <td>Centralization</td>
          <td>Inherently centralized</td>
          <td>Inherently decentralized</td>
        </tr>
      </table>
      
      <h4>Use Cases:</h4>
      
      <p><strong>HTTP Excels At:</strong></p>
      <ul>
        <li>Dynamic content that changes frequently</li>
        <li>User-specific content requiring authentication</li>
        <li>Applications requiring low latency</li>
        <li>Situations where clients have limited resources</li>
        <li>Widespread compatibility with existing infrastructure</li>
      </ul>
      
      <p><strong>IPFS Excels At:</strong></p>
      <ul>
        <li>Static content distribution</li>
        <li>Content archiving and preservation</li>
        <li>Scenarios requiring censorship resistance</li>
        <li>Areas with limited or intermittent connectivity</li>
        <li>Distributing large files efficiently</li>
      </ul>
      
      <h4>Integration Approaches:</h4>
      
      <p>Many applications combine both protocols:</p>
      <ul>
        <li>Using HTTP for dynamic content, user data, and API calls</li>
        <li>Using IPFS for static assets, content archives, and large file distribution</li>
        <li>IPFS gateways that allow HTTP clients to access IPFS content</li>
      </ul>
      
      <p>Rather than viewing them as competitors, HTTP and IPFS can be complementary technologies in a comprehensive web architecture.</p>
    `,
    level: 'intermediate',
  },
  {
    id: 'ipfs-in-practice',
    title: 'IPFS in Practice',
    description: 'Real-world applications and use cases for IPFS technology.',
    content: `
      <h3>IPFS in Practice: Real-World Applications</h3>
      
      <p>IPFS has moved beyond theoretical benefits to power real-world applications across various domains. Here are some of the most prominent use cases and implementations:</p>
      
      <h4>Web Hosting and Publishing</h4>
      <ul>
        <li><strong>Decentralized Websites</strong>: Sites hosted entirely on IPFS, sometimes with ENS/DNSLink for human-readable names.</li>
        <li><strong>Content Publishing Platforms</strong>: Platforms like Audius (music) and Matters (articles) use IPFS for content storage.</li>
        <li><strong>Archive Storage</strong>: Organizations like Internet Archive experimenting with IPFS for content preservation.</li>
      </ul>
      
      <h4>NFTs and Digital Art</h4>
      <ul>
        <li><strong>NFT Metadata and Assets</strong>: Many NFT platforms store artwork and metadata on IPFS to ensure permanence.</li>
        <li><strong>Digital Galleries</strong>: Decentralized art galleries that ensure artwork remains accessible.</li>
      </ul>
      
      <h4>Blockchain and Web3</h4>
      <ul>
        <li><strong>Decentralized Applications (dApps)</strong>: Many dApps store frontend assets on IPFS.</li>
        <li><strong>Smart Contract Data</strong>: Storing larger datasets referenced by blockchain smart contracts.</li>
        <li><strong>Blockchain Data Archiving</strong>: Historical blockchain data stored on IPFS.</li>
      </ul>
      
      <h4>File Sharing and Storage</h4>
      <ul>
        <li><strong>Decentralized Dropbox Alternatives</strong>: Services like Textile and Pinata.</li>
        <li><strong>Large Dataset Distribution</strong>: Scientific and research datasets shared globally.</li>
      </ul>
      
      <h4>Content Distribution Networks (CDNs)</h4>
      <ul>
        <li><strong>Decentralized CDNs</strong>: Using IPFS as an alternative to traditional CDNs.</li>
        <li><strong>Hybrid Solutions</strong>: Traditional CDNs with IPFS integration for resilience.</li>
      </ul>
      
      <h4>Censorship-Resistant Communication</h4>
      <ul>
        <li><strong>News and Information</strong>: Preserving access to information in regions with internet censorship.</li>
        <li><strong>Messaging Applications</strong>: Peer-to-peer messaging built on IPFS principles.</li>
      </ul>
      
      <h4>Package Distribution</h4>
      <ul>
        <li><strong>Software Packages</strong>: Distributing software updates and packages.</li>
        <li><strong>Operating System Images</strong>: OS distributions via IPFS.</li>
      </ul>
      
      <h4>Challenges in Production Environments</h4>
      <ul>
        <li>Gateway performance and reliability</li>
        <li>Content persistence strategies</li>
        <li>Integration with existing web infrastructure</li>
        <li>User experience considerations</li>
      </ul>
      
      <p>The adoption of IPFS continues to grow as organizations recognize its potential to create more resilient, efficient, and censorship-resistant applications and services.</p>
    `,
    level: 'advanced',
  }
];

const Learn: React.FC = () => {
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>('what-is-ipfs');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const currentTutorial = tutorials.find(t => t.id === selectedTutorial);

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const renderDifficultyBadge = (level: string) => {
    let color;
    switch (level) {
      case 'beginner':
        color = 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300';
        break;
      case 'intermediate':
        color = 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300';
        break;
      case 'advanced':
        color = 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-300';
        break;
      default:
        color = 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Learn About IPFS</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Understand how the InterPlanetary File System works and how to use it effectively.
        </p>
      </header>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle p-4 sticky top-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <BookOpen className="mr-2 text-primary-500" size={20} />
              Tutorials
            </h2>
            
            <ul className="space-y-2">
              {tutorials.map((tutorial) => (
                <li key={tutorial.id}>
                  <button
                    onClick={() => setSelectedTutorial(tutorial.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center ${
                      selectedTutorial === tutorial.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{tutorial.title}</div>
                      <div className="mt-1">{renderDifficultyBadge(tutorial.level)}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">External Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://docs.ipfs.tech" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    IPFS Documentation
                  </a>
                </li>
                <li>
                  <a 
                    href="https://proto.school/tutorials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    ProtoSchool Tutorials
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/ipfs/ipfs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    IPFS GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {currentTutorial ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                {currentTutorial.title}
              </h2>
              <div className="mb-6 flex items-center">
                {renderDifficultyBadge(currentTutorial.level)}
              </div>
              
              <div 
                className="prose prose-sm sm:prose max-w-none dark:prose-invert" 
                dangerouslySetInnerHTML={{ __html: currentTutorial.content }}
              />
              
              {/* FAQ Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h3>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('faq-1')}
                      className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <span>How do I ensure my files stay on IPFS permanently?</span>
                      {expandedSection === 'faq-1' ? (
                        <ChevronDown size={20} className="flex-shrink-0 text-gray-500" />
                      ) : (
                        <ChevronRight size={20} className="flex-shrink-0 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSection === 'faq-1' && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300">
                          To ensure your files remain on IPFS long-term, you need to "pin" them. Pinning tells an IPFS node to keep the file, preventing it from being garbage-collected. You can pin files on your own IPFS node or use a pinning service like Pinata, Infura, or Fleek. For maximum reliability, consider pinning your important files on multiple nodes or services.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('faq-2')}
                      className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <span>What's the difference between IPFS and Filecoin?</span>
                      {expandedSection === 'faq-2' ? (
                        <ChevronDown size={20} className="flex-shrink-0 text-gray-500" />
                      ) : (
                        <ChevronRight size={20} className="flex-shrink-0 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSection === 'faq-2' && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300">
                          IPFS and Filecoin are complementary protocols created by Protocol Labs. IPFS is a protocol for storing and sharing content in a distributed file system, focusing on content-addressing and efficient data transfer. Filecoin is a blockchain-based incentive layer built on top of IPFS that provides economic incentives for long-term file storage. In simple terms, IPFS defines how to store and retrieve content, while Filecoin creates a marketplace for storage where users can pay for guaranteed persistence.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('faq-3')}
                      className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <span>How do IPFS gateways work?</span>
                      {expandedSection === 'faq-3' ? (
                        <ChevronDown size={20} className="flex-shrink-0 text-gray-500" />
                      ) : (
                        <ChevronRight size={20} className="flex-shrink-0 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSection === 'faq-3' && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300">
                          IPFS gateways are HTTP servers that act as bridges between the traditional web (HTTP) and the IPFS network. They allow users to access IPFS content through regular web browsers without running an IPFS node. When you access content through a gateway (e.g., https://ipfs.io/ipfs/[CID]), the gateway retrieves the content from the IPFS network and serves it to you over HTTP. Public gateways like ipfs.io, dweb.link, and cloudflare-ipfs.com provide this service for free, though they may have rate limits or restrictions on content size.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Select a tutorial from the sidebar to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learn;