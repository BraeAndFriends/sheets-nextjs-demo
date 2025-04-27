'use client'

import React, { useEffect, useRef, useState } from 'react'
 
import { createUniver, defaultTheme, LocaleType, merge } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import UniverPresetSheetsCoreEnUS from '@univerjs/presets/preset-sheets-core/locales/en-US';
import { UniverSheetsAdvancedPreset } from '@univerjs/presets/preset-sheets-advanced';
import UniverPresetSheetsAdvancedEnUS from '@univerjs/presets/preset-sheets-advanced/locales/en-US';
import { UniverSheetsDrawingPreset } from '@univerjs/presets/preset-sheets-drawing'
import UniverPresetSheetsDrawingEnUS from '@univerjs/presets/preset-sheets-drawing/locales/en-US'

import '@univerjs/presets/lib/styles/preset-sheets-core.css';
import '@univerjs/presets/lib/styles/preset-sheets-drawing.css'
import '@univerjs/presets/lib/styles/preset-sheets-advanced.css'
 
const UniverSheetComponent = function () {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [univerAPI, setUniverAPI] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const { univerAPI } = createUniver({
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: merge(
          {},
          UniverPresetSheetsCoreEnUS,
          UniverPresetSheetsAdvancedEnUS,
          UniverPresetSheetsDrawingEnUS
        ),
      },
      theme: defaultTheme,
      presets: [
        UniverSheetsCorePreset({
          container: containerRef.current,
        }),
        UniverSheetsDrawingPreset(),
        UniverSheetsAdvancedPreset({
          universerEndpoint: 'http://localhost:8000',
        }),
      ],
    });

    setUniverAPI(univerAPI);
    univerAPI.createWorkbook({ name: 'Test Sheet' });
    
    return () => {
      univerAPI.dispose();
    };
  }, []);
  
  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !univerAPI) return;
    
    // Prevent event from potentially being processed again
    event.preventDefault();

    console.log("Hello");
    
    const file = event.target.files[0];
    try {
      // Import XLSX file to snapshot
      const snapshot = await univerAPI.importXLSXToSnapshotAsync(file);

      console.log(typeof snapshot);
      console.log('Snapshot created:', snapshot);
      
      // Create a new workbook with the snapshot
      if (snapshot) {
        univerAPI.createWorkbook(snapshot);
      }
    } catch (error) {
      console.error('Error importing Excel file:', error);
    } finally {
      // Reset the file input to ensure it triggers correctly on the same file selection
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const downloadFile = (file: Blob, fileName: string, fileType: string) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = async () => {
    if (!univerAPI) return;
    
    try {
      const fWorkbook = univerAPI.getActiveWorkbook();
      const snapshot = fWorkbook.save();
      const file = await univerAPI.exportXLSXBySnapshotAsync(snapshot);
      
      // Download the file
      downloadFile(file, 'univer', 'xlsx');
    } catch (error) {
      console.error('Error exporting Excel file:', error);
    }
  };
 
  return (
    <div>
      <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', marginLeft: '10px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
        <span>Spreadsheet Demo</span>
        <button 
          onClick={triggerFileInput}
          style={{
            marginLeft: '20px',
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Import Excel
        </button>
        <button 
          onClick={handleExportExcel}
          style={{
            marginLeft: '10px',
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Export Excel
        </button>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleImportExcel}
          accept=".xlsx"
          style={{ display: 'none' }}
        />
      </div>
      <div style={{ width: '100vw', height: '90vh' }} ref={containerRef}></div>
    </div>
  );
};

export default UniverSheetComponent; 