import type { Uri } from 'vscode';
import type { BrowseRepoAtRevisionCommandArgs } from '../commands/browseRepoAtRevision';
import type { QuickWizardCommandArgs, QuickWizardCommandArgsWithCompletion } from '../commands/quickWizard';
import { Commands } from '../constants.commands';
import { executeCommand, executeEditorCommand } from '../system/command';
import { defer } from '../system/promise';

export async function executeGitCommand(args: QuickWizardCommandArgs): Promise<void> {
	const deferred = defer<void>();
	void (await executeCommand<QuickWizardCommandArgsWithCompletion>(Commands.GitCommands, {
		...args,
		completion: deferred,
	}));
	return deferred.promise;
}

export async function browseAtRevision(uri: Uri, options?: { before?: boolean; openInNewWindow?: boolean }) {
	void (await executeEditorCommand<BrowseRepoAtRevisionCommandArgs>(Commands.BrowseRepoAtRevision, undefined, {
		uri: uri,
		before: options?.before,
		openInNewWindow: options?.openInNewWindow,
	}));
}
