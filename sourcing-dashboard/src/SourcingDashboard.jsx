import Suppliers from './Suppliers';
import React, { useEffect, useState } from 'react';
import {
  BarChart3, Bell, Check, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList,
  Copy, Download, Eye, FileSpreadsheet, Filter, Globe2, Home, LayoutGrid, Menu,
  PackageSearch, Search, Settings, ShieldCheck, Tag, Upload, Users, X
} from 'lucide-react';

const workbookUrl = new URL('../SUPPLIER DATA-1.xlsx', import.meta.url).href;
const columnOptions = [
  { key: 'serialNo', label: 'S.No' },
  { key: 'supplierName', label: 'Supplier Name' },
  { key: 'companyName', label: 'Company Name' },
  { key: 'productName', label: 'Product' },
  { key: 'address', label: 'Address' },
  { key: 'contactNumber', label: 'Contact No.' },
  { key: 'action', label: 'Action' }
];

const formatSuppliers = (data) => data.map((item, index) => ({
  id: index + 1,
  serialNo: String(item['S.NO'] || index + 1),
  supplierName: String(item['SUPPLIER NAME'] || ''),
  companyName: String(item['SUPPLIER COMPANY NAME'] || ''),
  productName: String(item.PRODUCT || ''),
  address: String(item.ADDRESS || ''),
  contactNumber: String(item['CONTACT NO.'] || '')

}));

export default function SourcingDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [page, setPage] = useState(1);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [contactsCopied, setContactsCopied] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => new Set(columnOptions.map((c) => c.key)));
  const [showFilters, setShowFilters] = useState(false);

  const toggleColumn = (key) => {
    setVisibleColumns((currentColumns) => {
      const nextColumns = new Set(currentColumns);
      if (nextColumns.has(key)) {
        nextColumns.delete(key);
      } else {
        nextColumns.add(key);
      }
      return nextColumns;
    });
  };

  const toggleSupplier = (id) => {
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(id)) nextIds.delete(id);
      else nextIds.add(id);
      return nextIds;
    });
  };

  const toggleVisibleSuppliers = () => {
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds);
      const allVisibleSelected = filteredSuppliers.length > 0 && filteredSuppliers.every((item) => nextIds.has(item.id));
      filteredSuppliers.forEach((item) => {
        if (allVisibleSelected) nextIds.delete(item.id);
        else nextIds.add(item.id);
      });
      return nextIds;
    });
  };

  const readWorkbook = async (buffer) => {
    const { read, utils } = await import('xlsx');
    const wb = read(buffer, { type: 'array' });
    const firstSheet = wb.Sheets[wb.SheetNames[0]];
    return formatSuppliers(utils.sheet_to_json(firstSheet, { defval: '' }));
  };

  useEffect(() => {
    fetch(workbookUrl)
      .then((response) => {
        if (!response.ok) throw new Error('The bundled workbook could not be loaded.');
        return response.arrayBuffer();
      })
      .then(readWorkbook)
      .then((data) => {
        setSuppliers(data);
        setUploadSuccess(true);
      })
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const formattedData = await readWorkbook(event.target.result);
      setSuppliers(formattedData);
      setUploadSuccess(true);
      setLoadError('');
    };
    reader.readAsArrayBuffer(file);
  };

  // Filter suppliers based on product search or supplier name
  const filteredSuppliers = suppliers.filter((item) =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.contactNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [pageSize] = useState(20);
  const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedSuppliers = filteredSuppliers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleContactsCount = filteredSuppliers.filter((item) => item.contactNumber).length;

  const copyVisibleContacts = async () => {
    const contacts = filteredSuppliers
      .map((item) => item.contactNumber)
      .filter(Boolean);
    if (contacts.length === 0) return;

    const searchName = searchQuery.trim() || 'All suppliers';
    const plainText = `${searchName}\n${contacts.join('\n')}`;
    const html = `<strong>${searchName.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character])}</strong><br>${contacts.join('<br>')}`;

    if (typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
          'text/html': new Blob([html], { type: 'text/html' })
        })
      ]);
    } else {
      await navigator.clipboard.writeText(plainText);
    }
    setContactsCopied(true);
    setTimeout(() => setContactsCopied(false), 2000);
  };

  // Copy structured details to clipboard for employees
  const handleCopy = (item) => {
    const textToCopy = `*Supplier Sourcing Details*\n` +
      `• S.No: ${item.serialNo}\n` +
      `• Product: ${item.productName}\n` +
      `• Supplier: ${item.supplierName}\n` +
      `• Company: ${item.companyName}\n` +
      `• Address: ${item.address}\n` +
      `• Contact: ${item.contactNumber}\n` +
      `• Source: SUPPLIER DATA-1.xlsx`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const updateSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  return (
    <div className="dashboard-shell min-h-screen font-sans">
      <aside className="dashboard-sidebar hidden lg:flex">
        <div className="sidebar-brand"><span className="brand-mark"><Users size={18} /></span><span><b>Supplier Hub</b><small>Intelligent Workspace</small></span></div>
        <nav className="sidebar-nav">
  {[['Dashboard', Home], ['Suppliers', Users], ['Contacts', ClipboardList], ['Tasks', Check], ['Follow Ups', Bell], ['Analytics', BarChart3], ['Settings', Settings]].map(([label, Icon]) => (
    <button
      key={label}
      className={`sidebar-link ${activeView === label.toLowerCase() ? 'active' : ''}`}
      onClick={() => setActiveView(label.toLowerCase())}
    >
              <Icon size={16} />{label}
            </button>
          ))}
        </nav>
        <div className="smart-tip"><b>Smart Tip</b><span>Keep your supplier data up to date to build stronger relationships.</span><a>Learn More <ChevronRight size={13} /></a></div>
        <div className="need-help"><b><ShieldCheck size={14} /> Need Help?</b><span>Contact Support</span><small>support@supplierhub.com</small></div>
        <div className="sidebar-user"><span>MA</span><div><b>Mohamed Thameem Ansari</b><small>Administrator</small></div><ChevronRight size={14} /></div>
      </aside>
      <main className="dashboard-main dashboard-content p-4 md:p-7">
          {activeView === 'suppliers' ? (
            <Suppliers />
          ) : (
            <>
              {/* existing header, metrics, table, ellam idhu ulla wrap pannunga */}
        <header className="dashboard-topbar">
          <div><p className="welcome-line">Welcome back, Mr. Mohamed Thameem Ansari! <span>👋</span></p><h1>Sourcing & Supplier Dashboard</h1><p>Find the right supplier faster, then share a clean contact list with your team.</p></div>
          <div className="top-actions"><label className="dashboard-loaded dashboard-upload"><Upload size={15} /> Import/Replace Excel<input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" /></label>{uploadSuccess && <span className="dashboard-loaded"><CheckCircle2 size={15} /> Loaded ({suppliers.length})</span>}<button className="mobile-menu"><Menu size={18} /></button></div>
        </header>
        <section className="metrics-grid">
          {[[Users, 'Total Suppliers', suppliers.length || 0, 'All suppliers in list', 'teal'], [Eye, 'Visible Suppliers', filteredSuppliers.length, 'Currently showing', 'blue'], [Globe2, 'Countries', '18', 'Global coverage', 'purple'], [Tag, 'Categories', '32', 'Product categories', 'orange']].map(([Icon, label, value, sub, color]) => <div className={`metric-card ${color}`} key={label}><div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div><Icon size={25} /></div>)}
        </section>
        <section className="toolbar-card">
          <div className="toolbar-row"><div className="dashboard-search"><Search size={17} /><input type="text" placeholder="Search by supplier name, product, company..." value={searchQuery} onChange={updateSearch} /><kbd>⌘ K</kbd></div><button className={`filter-button ${showFilters ? 'selected' : ''}`} onClick={() => setShowFilters(!showFilters)}><Filter size={15} /> Advanced Filters</button></div>
          {showFilters && <div className="advanced-filter"><span>Searches every supplier, company, product, address, and contact field.</span><button onClick={() => { setSearchQuery(''); setPage(1); }}><X size={13} /> Clear search</button></div>}
          <div className="column-row"><span>Show columns:</span>{columnOptions.map((column) => <label key={column.key}><input type="checkbox" checked={visibleColumns.has(column.key)} onChange={() => toggleColumn(column.key)} />{column.label}</label>)}</div>
        </section>
        <div className="table-actions"><label><input type="checkbox" checked={paginatedSuppliers.length > 0 && paginatedSuppliers.every((item) => selectedIds.has(item.id))} onChange={toggleVisibleSuppliers} /> Select visible suppliers ({filteredSuppliers.length})</label><div><button className="export-button" onClick={copyVisibleContacts} disabled={!visibleContactsCount}><Download size={14} /> Export Visible ({visibleContactsCount})</button><button className="dashboard-copy" onClick={copyVisibleContacts} disabled={!visibleContactsCount}>{contactsCopied ? <CheckCircle2 size={15} /> : <Copy size={15} />} {contactsCopied ? 'Contacts copied' : `Copy Visible Contacts (${visibleContactsCount})`}</button></div></div>
        <div className="dashboard-table overflow-hidden rounded-2xl border shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left border-collapse text-sm"><thead><tr><th className="p-3 w-10"><span className="sr-only">Select</span></th>{columnOptions.map((column) => visibleColumns.has(column.key) && <th key={column.key} className={`p-3${column.key === 'action' ? ' text-center' : ''}`}>{column.label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{paginatedSuppliers.length > 0 ? paginatedSuppliers.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 w-12">
                        <input
                          type="checkbox"
                          aria-label={`Select ${item.supplierName || item.companyName || item.serialNo}`}
                          checked={selectedIds.has(item.id)}
                          onChange={() => toggleSupplier(item.id)}
                          className="h-4 w-4 accent-blue-600"
                        />
                      </td>
                      {visibleColumns.has('serialNo') && <td className="p-4"><div className="font-medium text-slate-800">{item.serialNo}</div></td>}
                      {visibleColumns.has('supplierName') && <td className="p-4 font-bold text-slate-900">{item.supplierName || '-'}</td>}
                      {visibleColumns.has('companyName') && <td className="p-4 text-slate-700">{item.companyName || '-'}</td>}
                      {visibleColumns.has('productName') && <td className="p-4 font-bold text-slate-900">{item.productName || '-'}</td>}
                      {visibleColumns.has('address') && <td className="p-4 text-slate-500 text-xs min-w-80">{item.address || '-'}</td>}
                      {visibleColumns.has('contactNumber') && <td className="p-4 text-slate-600 font-mono text-xs whitespace-nowrap">{item.contactNumber || '-'}</td>}
                      {visibleColumns.has('action') && <td className="p-4 text-center">
                        <button
                          onClick={() => handleCopy(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm ${
                            copiedId === item.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <Copy size={14} />
                          {copiedId === item.id ? 'Copied!' : 'Copy'}
                        </button>
                      </td>}
                    </tr>
                  ))
                : (
                  <tr>
                    <td colSpan={Math.max(visibleColumns.size + 1, 1)} className="p-16 text-center text-slate-400">
                      <FileSpreadsheet className="mx-auto mb-3 text-slate-300" size={42} />
                      {isLoading ? (
                        <p>Loading supplier data...</p>
                      ) : loadError ? (
                        <p className="text-rose-600">{loadError}</p>
                      ) : suppliers.length === 0 ? (
                        <div>
                          <p className="font-medium text-slate-600">No supplier data loaded yet.</p>
                          <p className="text-xs text-slate-400 mt-1">Upload a supplier Excel file using the button above.</p>
                        </div>
                      ) : (
                        <p>No matching products found for "{searchQuery}".</p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody></table></div><div className="table-footer"><span>Showing {filteredSuppliers.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers</span><div className="pagination"><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={14} /></button>{Array.from({ length: Math.min(totalPages, 4) }, (_, index) => index + 1).map((number) => <button key={number} className={currentPage === number ? 'current' : ''} onClick={() => setPage(number)}>{number}</button>)}{totalPages > 4 && <span>...</span>}<button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}><ChevronRight size={14} /></button><select value={pageSize} readOnly><option>20 / page</option></select></div></div></div>
        <section className="utility-grid"><div><ClipboardList size={25} /><b>Stay Organized</b><span>Use filters, tags, and follow-ups to never miss an opportunity.</span><a>Learn More <ChevronRight size={13} /></a></div><div><Bell size={25} /><b>Follow Ups</b><span>You have 05 pending follow-ups scheduled this week.</span><a>View Follow Ups <ChevronRight size={13} /></a></div><div><ShieldCheck size={25} /><b>Data Safe</b><span>Your supplier data is secure and backed up.</span><a>View Settings <ChevronRight size={13} /></a></div></section>
          </>
  )}
</main>
    </div>
  );
}