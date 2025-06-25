import React, { useState } from "react";
import Form from "../Form/Form";
import Table from "../Table/Table";
import { serverBase } from "../../api";

import styles from "./Container.module.css";

export default function Container({ auth, userLinks, setUserLinks }) {
  const [isLoading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [fetchedData, setFetchedData] = useState(null);

  return (
    <div className={styles.container}>
      <Form
        setLoading={setLoading}
        setErrMsg={setErrMsg}
        setFetchedData={setFetchedData}
        auth={auth}
        setUserLinks={setUserLinks}
      />

      {isLoading && (
        <img className={styles.spinner} src="/preloader.gif" alt="Loading..." />
      )}

      {errMsg && <p className={styles.err}>{errMsg}</p>}

      {!isLoading && !errMsg && fetchedData && (
        <Table full={fetchedData.full} short={fetchedData.short} clicks={fetchedData.clicks} />
      )}

      {/* User's links table with analytics */}
      {userLinks && userLinks.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3>Your Shortened Links</h3>
          <table style={{ margin: "0 auto" }}>
            <thead>
              <tr>
                <th>Original URL</th>
                <th>Short URL</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {userLinks.map(link => (
                <tr key={link._id}>
                  <td><a href={link.full} target="_blank" rel="noopener noreferrer">{link.full}</a></td>
                  <td><a href={`${serverBase}/${link.short}`} target="_blank" rel="noopener noreferrer">{link.short}</a></td>
                  <td>{link.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
