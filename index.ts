import { TodoistApi } from '@doist/todoist-api-typescript';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

class TodoistToRemindersSync {
    private todoist: TodoistApi;

    constructor(apiToken: string) {
        this.todoist = new TodoistApi(apiToken);
    }

    // New method to get all project IDs and names
    async listProjects() {
        try {
            const projects = await this.todoist.getProjects();
            console.log('Todoist Projects:');
            projects.forEach(project => {
                console.log(`Project Name: ${project.name}, ID: ${project.id}`);
            });
            return projects;
        } catch (error) {
            console.error('Error fetching Todoist projects:', error);
            return [];
        }
    }

    async getTodoistTasks(projectId?: string) {
        try {
            return projectId
                ? await this.todoist.getTasks({ projectId })
                : await this.todoist.getTasks();
        } catch (error) {
            console.error('Error fetching Todoist tasks:', error);
            return [];
        }
    }

    private convertToAppleScriptDate(dueDate?: string): string {
        if (!dueDate) return '';
        try {
            const date = new Date(dueDate);
            return `date "${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}"`;
        } catch {
            return '';
        }
    }

    private migrateTask(task: any): boolean {
        try {
            // Escape quotes and special characters
            const sanitizedName = task.content.replace(/"/g, '\\"');
            const dueDateScript = task.due ? this.convertToAppleScriptDate(task.due.date) : '';

            const appleScript = `
                tell application "Reminders"
                    make new reminder with properties {name:"${sanitizedName}"}
                    ${dueDateScript ? `set due date of the last reminder to ${dueDateScript}` : ''}
                end tell
            `;

            // Execute AppleScript
            execSync(`osascript -e '${appleScript}'`);
            return true;
        } catch (error) {
            console.error(`Failed to migrate task: ${task.content}`, error);
            return false;
        }
    }

    async migrateTasks(projectId?: string) {
        const tasks = await this.getTodoistTasks(projectId);
        
        const migrationResults = {
            total: tasks.length,
            migrated: 0,
            failed: 0
        };

        for (const task of tasks) {
            const success = this.migrateTask(task);
            success ? migrationResults.migrated++ : migrationResults.failed++;
        }

        return migrationResults;
    }
}

async function main() {
    // Retrieve Todoist API token from environment
    const apiToken = process.env.TODOIST_API_TOKEN;

    if (!apiToken) {
        console.error('Please set TODOIST_API_TOKEN in .env file');
        process.exit(1);
    }

    try {
        const migrator = new TodoistToRemindersSync(apiToken);
        
        // List all projects first
        await migrator.listProjects();

        // Uncomment and modify if you want to migrate a specific project
        // const results = await migrator.migrateTasks('YOUR_PROJECT_ID');
        
        // Or migrate all tasks
        const results = await migrator.migrateTasks();

        console.log('Migration Complete:');
        console.log(`Total Tasks: ${results.total}`);
        console.log(`Migrated Tasks: ${results.migrated}`);
        console.log(`Failed Tasks: ${results.failed}`);
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

main();
