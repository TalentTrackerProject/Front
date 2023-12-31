import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ReactComponent as SearchLogo } from "./iconmonstr-search-thin.svg";
import { ReactComponent as Upload } from "./iconmonstr-upload-17.svg";
import { ReactComponent as Drop } from "./iconmonstr-arrow-65.svg";
import { search, uploadCV } from "./services";

function App() {
  const [file, setFile] = useState<File>();
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<CVModel[]>([]);
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      search(searchInput).then((res) => {
        if (res.data.length === 0) {
          alert("No CVs matching the provided keywords.");
        }
        setSearchResult(res.data);
      });
    },
    [searchInput]
  );

  const handleUpload = useCallback(() => {
    if (file)
      uploadCV(file)
        .then((res) => {
          alert(`${res.data.id} uploaded`);
          setFile(undefined);
        })
        .catch(console.error);
  }, [file]);
  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="app">
      <div className="background-container">
        <div className="search-upload">
          <div className="search-result">
            <div className="search-box">
              <form className="searchbar" onSubmit={handleSearch}>
                <input
                  type="search"
                  name="search"
                  value={searchInput}
                  id="search"
                  placeholder="Search a CV..."
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <SearchLogo onClick={handleSearch} />
              </form>
            </div>
            <div className="result">
              {searchResult.length > 0 ? (
                <h2 style={{ width: "80%" }}>Results "{searchInput}":</h2>
              ) : (
                <h2>No CVs matching the provided keywords.</h2>
              )}
              {searchResult.map((val: CVModel) => {
                return (
                  <>
                    <div key={`cv${val.id}`} className="cv-result">
                      <p>
                        <b>CV ID: {val.id}</b>
                        <br />
                        <b>CV Name: {val.filename.substring(20)}</b>
                        <br />
                        type: {val.type}
                        <br />
                        Upload date:{" "}
                        {new Date(parseInt(val.uploadedDate)).toUTCString()}
                        <br />
                        <iframe
                          src={val.filename}
                          width="600"
                          height="600"
                          title={`CV Document ${val.id}`}
                        ></iframe>
                      </p>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div className="upload-zone">
            <div className="drag-and-drop">
              <div className="drop-zone" {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? <Drop /> : <Upload />}
                <p style={{ marginTop: 15 }}>{file?.name}</p>
              </div>
              <button
                id="upload-button"
                disabled={file === undefined}
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;