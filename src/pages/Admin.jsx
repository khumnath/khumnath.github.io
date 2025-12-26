import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getAllPosts } from "../utils/loadPosts";
import ReactMarkdown from "react-markdown";
import MarkdownIt from 'markdown-it';
import MdEditor, { PluginComponent } from 'react-markdown-editor-lite';

// Custom Color Picker Plugin
class ColorPlugin extends PluginComponent {
  static pluginName = 'color-picker';
  static align = 'left';

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const color = e.target.value;
    if (this.editor) {
      this.editor.insertText(`<span style="color: ${color}">change this </span>`);
    }
  }

  render() {
    return (
      <span className="rc-md-navigation-icon" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title="Text Color">
        <i className="fa fa-paint-brush" style={{ fontSize: '14px' }}></i>
        <input
          type="color"
          onChange={this.handleChange}
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            left: 0,
            top: 0
          }}
        />
      </span>
    );
  }
}


if (typeof window !== 'undefined') {
  MdEditor.use(ColorPlugin);
}
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("list"); // list, editor
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
    author: "khumnath",
    lang: "en",
    lng_pair: "",
    category: "others",
    tags: "",
    content: "# New Post\n\nStart writing...",
    image: ""
  });
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");

  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  const handleEdit = (post) => {
    // Populate form from post
    setFormData({
      title: post.title || "",
      date: post.date ? new Date(post.date).toISOString().split('T')[0] : "",
      author: post.author || "khumnath",
      lang: post.lang || "en",
      lng_pair: post.lng_pair || "",
      category: post.category || "others",
      tags: post.tags ? post.tags.join(", ") : "",
      content: post.content || "",
      image: post.img || ""
    });
    setView("editor");
  };

  const handleCreate = () => {
    setFormData({
      title: "",
      date: new Date().toISOString().split('T')[0],
      author: "khumnath",
      lang: "en",
      lng_pair: `id_page${Date.now()}`, // auto-gen ID
      category: "others",
      tags: "",
      content: "# New Post\n\n",
      image: ""
    });
    setView("editor");
  };

  const generateFile = () => {
    const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
    const frontmatter = `---
lng_pair: ${formData.lng_pair}
title: ${formData.title}
author: ${formData.author}
category: ${formData.category}
tags: [ ${tagsArray.join(", ")} ]
img: "${formData.image}"
date: ${formData.date}
---

${formData.content}`;

    setGeneratedMarkdown(frontmatter);

    // Trigger Download
    const blob = new Blob([frontmatter], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `${formData.date}-${formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.markdown`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Manager</h1>
          {view === 'list' && (
            <button
              onClick={handleCreate}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition shadow-md flex items-center gap-2"
            >
              <i className="fa fa-plus"></i> New Post
            </button>
          )}
          {view === 'editor' && (
            <button
              onClick={() => setView('list')}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>

        {view === 'list' && (
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-[#252525] border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Title</th>
                  <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Lang</th>
                  <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {posts.map(post => (
                  <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300 font-mono">
                      {new Date(post.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white font-medium">
                      {post.title}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${post.lang === 'en' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {post.lang}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleEdit(post)} className="text-primary hover:underline text-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Column (Full Width now) */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Meta Data</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lang</label>
                    <select
                      value={formData.lang}
                      onChange={e => setFormData({ ...formData, lang: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white"
                    >
                      <option value="en">English (en)</option>
                      <option value="ne">Nepali (ne)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pair ID</label>
                    <input
                      type="text"
                      value={formData.lng_pair}
                      onChange={e => setFormData({ ...formData, lng_pair: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white font-mono"
                      placeholder=":image_name.jpg"
                    />
                    <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center transition-colors">
                      <i className="fa fa-image mr-2"></i> Pick
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setFormData(prev => ({ ...prev, image: `:${e.target.files[0].name}` }));
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <i className="fa fa-info-circle mr-1"></i>
                    Move the file to assets/img manually.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e1e1e] p-1 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm h-[600px] flex flex-col">
                <MdEditor
                  style={{ height: '100%', width: '100%' }}
                  renderHTML={text => mdParser.render(text)}
                  onChange={({ text }) => setFormData({ ...formData, content: text })}
                  value={formData.content}
                  view={{ menu: true, md: true, html: true }}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex justify-between items-center text-sm text-blue-800 dark:text-blue-300">
                <span>
                  <i className="fa fa-info-circle mr-2"></i>
                  Save downloads a file. Place it in <strong>{formData.lang === 'ne' ? 'ne/_posts/' : '_posts/'}</strong>
                </span>
                <button
                  onClick={generateFile}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition shadow-md font-bold"
                >
                  <i className="fa fa-download mr-2"></i> Save File
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Admin;
