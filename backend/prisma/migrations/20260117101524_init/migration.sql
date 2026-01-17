-- CreateIndex
CREATE INDEX "TimeEntry_date_idx" ON "TimeEntry"("date");

-- CreateIndex
CREATE INDEX "TimeEntry_project_idx" ON "TimeEntry"("project");

-- CreateIndex
CREATE INDEX "TimeEntry_date_project_idx" ON "TimeEntry"("date", "project");
