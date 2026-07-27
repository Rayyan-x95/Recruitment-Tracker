package com.rectracker.utility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component
public class DBConnectionUtil {

    private final DataSource dataSource;

    @Autowired
    public DBConnectionUtil(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Obtains a standard JDBC Connection from the configured DataSource pool.
     */
    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    /**
     * Utility method to check database connection status.
     */
    public boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            return false;
        }
    }
}
