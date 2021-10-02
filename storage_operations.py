import os, sys
import win32net
import win32netcon
import win32con
import win32api
import win32security
from ntsecuritycon import FILE_READ_ATTRIBUTES, FILE_READ_DATA, FILE_READ_EA, SYNCHRONIZE,\
STANDARD_RIGHTS_READ, STANDARD_RIGHTS_WRITE, STANDARD_RIGHTS_EXECUTE, FILE_APPEND_DATA, \
FILE_WRITE_ATTRIBUTES, FILE_WRITE_DATA, FILE_WRITE_EA, WRITE_OWNER, WRITE_DAC, READ_CONTROL, \
SI_ADVANCED, SI_EDIT_AUDITS, SI_EDIT_PROPERTIES, SI_EDIT_ALL, SI_PAGE_TITLE, SI_RESET, \
SI_ACCESS_SPECIFIC, SI_ACCESS_GENERAL, SI_ACCESS_CONTAINER, SI_ACCESS_PROPERTY, \
FILE_ALL_ACCESS, FILE_GENERIC_READ, FILE_GENERIC_WRITE, FILE_GENERIC_EXECUTE, \
OBJECT_INHERIT_ACE, CONTAINER_INHERIT_ACE, INHERIT_ONLY_ACE, \
SI_PAGE_PERM, SI_PAGE_ADVPERM, SI_PAGE_AUDIT, SI_PAGE_OWNER, PSPCB_SI_INITDIALOG, \
SI_CONTAINER, FILE_TRAVERSE, FILE_DELETE_CHILD
import platform

def add_user_to_group(user, password = None, userGroup = None):
    USER = user
    PASSWORD = password
    GROUP = userGroup
    #
    # Create a new user with minimum privs.
    # If it exists already, drop it first.
    #
    user_info = dict (
      name = USER,
      password = PASSWORD,
      priv = win32netcon.USER_PRIV_USER,
      home_dir = None,
      comment = "This is a free user with free license",
      flags = win32netcon.UF_SCRIPT,
      script_path = None
    )

    try:
        win32net.NetUserAdd (None, 1, user_info)
    except:
        print("This account is already existed!!")

    #
    # Add the new user to the new group
    #
    user_group_info = dict (
      domainandname = USER
    )

    try:
        win32net.NetLocalGroupAddMembers (None, GROUP, 3, [user_group_info])
    except:
        print("this account is also in this group too!!")

def get_permission(filename):
    print
    print
    for line in os.popen("cacls %s" % filename).read().splitlines():
        print(line)

#get_permission("D:\\user_storage\\u2")

def isExisted(user, path = "D:\\user_storage\\"):
    FILENAME = path + USER

    if os.path.exists(FILENAME):
        print("This directory have existed!!")
    else:
        os.mkdir(FILENAME)

def convert_right(right: str):
    accessRight = 0

    for _r in right.split(''):
        accessRight |= _r

    return accessRight

def set_permission(user, right = FILE_GENERIC_READ, isInheritanced = True, filename = None):
    if isInheritanced:
        _t = win32security.CONTAINER_INHERIT_ACE | win32security.OBJECT_INHERIT_ACE
    else:
        _t = win32security.INHERIT_ONLY_ACE

    entry = [
        {
            'AccessMode': win32security.GRANT_ACCESS,
            'AccessPermissions': right,
            'Inheritance': _t,
            'Trustee': {
                'TrusteeType': win32security.TRUSTEE_IS_USER,
                'TrusteeForm': win32security.TRUSTEE_IS_NAME,
                'Identifier': user
            }    
        }
    ]

    try:
        sd = win32security.GetFileSecurity(filename, win32security.DACL_SECURITY_INFORMATION)
    except:
        return 1

    dacl = sd.GetSecurityDescriptorDacl()
    dacl.SetEntriesInAcl(entry)

    win32security.SetNamedSecurityInfo(filename, win32security.SE_FILE_OBJECT,
        win32security.DACL_SECURITY_INFORMATION,
        None, None, dacl, None)

def delete_permission(user, filename):
    # detect specified user is to remove his/her permission
    userSid, domain, type = win32security.LookupAccountName("", user)

    # delete completely
    dacl.AddAccessDeniedAce(win32security.ACL_REVISION, con.FILE_ALL_ACCESS, userSid)

#def delete_permission(path, username):
#    """Remove the ace for the given users."""
#    if not os.path.exists(path):
#        raise WindowsError('Path %s could not be found.' % path)

#    user, domain, type = win32security.LookupAccountName("", username)

#    sd = win32security.GetFileSecurity(path, win32security.DACL_SECURITY_INFORMATION)
#    dacl = sd.GetSecurityDescriptorDacl()
#    for index in range(0, dacl.GetAceCount()):
#        ace = dacl.GetAce(index)
#        print(ace)
#        if user == ace[2]:
#            pass
#            #dacl.DeleteAce(index)

#    sd.SetSecurityDescriptorDacl(1, dacl, 0)
#    win32security.SetFileSecurity(path, win32security.DACL_SECURITY_INFORMATION, sd)

def revert_from_bitmask(accessBitmask):
    rights = 'NOTHING'

    if accessBitmask == FILE_GENERIC_READ:
        return str("FILE_GENERIC_READ")

    if accessBitmask == FILE_GENERIC_WRITE:
        return str("FILE_GENERIC_WRITE")

    if accessBitmask == FILE_GENERIC_EXECUTE:
        return str("FILE_GENERIC_EXECUTE")

    if accessBitmask == FILE_ALL_ACCESS:
        return str("FILE_ALL_ACCESS")

    for field in [FILE_GENERIC_READ, FILE_GENERIC_WRITE, FILE_GENERIC_EXECUTE, FILE_ALL_ACCESS]:
        if accessBitmask == field:
            return "{}".format(str(field).__repr__())

        for combinedField in [FILE_GENERIC_READ, FILE_GENERIC_WRITE, FILE_GENERIC_EXECUTE, FILE_ALL_ACCESS]:
            if field | combinedField == accessBitmask:
                return "{} and {}".format(str(field).__repr__(), str(combinedField).__repr__())

            for thirdField in [FILE_GENERIC_READ, FILE_GENERIC_WRITE, FILE_GENERIC_EXECUTE, FILE_ALL_ACCESS]:
                if field | combinedField | thirdField == accessBitmask:
                    return "{} and {} and {}".format(str(field).__repr__(), str(combinedField).__repr__(), str(thirdField).__repr__())
    
    return rights

def list_all_user_permission(path):
    sd = win32security.GetFileSecurity(path, win32security.DACL_SECURITY_INFORMATION)
    dacl = sd.GetSecurityDescriptorDacl()
    list = []

    for index in range(0, dacl.GetAceCount()):
        ace = dacl.GetAce(index)
        userSid = ace[2]
        user, domain, type = win32security.LookupAccountSid(None, userSid)
        list.append(dict({
            "userId": win32security.ConvertSidToStringSid(userSid),
            "domain": domain,
            "user": user
        }))
      
    return dacl.GetExplicitEntriesFromAcl()

#delete_permission("D:\\user_storage\\u2", "u1")
#print(list_all_user_permission("D:\\user_storage\\u2"))



#import wmi
#c = wmi.WMI ()

# physical_disk ==> physical_disk.deviceID, physical_disk.InterfaceType, physical_disk.Partitions, physical_disk.MediaType
# physical_disk.Size, physical_disk.Status, physical_disk.SerialNumber

# partition.BlockSize, partition.Bootable, partition.Size, partition.PrimaryPartition, partition.Type, partition.DiskIndex
# partition.Index, partition.NumberOfBlock

# logical_disk.DeviceID, logical_disk.DriveType, logical_disk.DriveType, logical_disk.FileSystem, logical_disk.FreeSpace
# logical_disk.Size, logical_disk.VolumeName, logical_disk.VolumeSerialNumber

#for physical_disk in c.Win32_DiskDrive():
#    for partition in physical_disk.associators ("Win32_DiskDriveToDiskPartition"):
#        for logical_disk in partition.associators ("Win32_LogicalDiskToPartition"):
#            print(physical_disk.Model, partition.Caption, logical_disk.Caption)


if __name__ == "__main__":
    import argparse
    import re

    print("Hello world")

    regPath = re.compile('^([A-Z]{1}\:{1}\/)(\w+\s*|\/)*')
    regFile = re.compile('^([A-Z]{1}\:{1}\/)(\w+\s*|\/)*(\.[a-z]+)$')

    # Initialize parser
    parser = argparse.ArgumentParser()

    parser.add_argument("-l", "--list", help = "Show list all files and directories permission in specified directory")
    parser.add_argument("-f", "--filename", help = "Get Specified file permission")

    args = parser.parse_args()

    print(args)

    if args.list:
        if regPath.match(args.list):
            list_all_user_permission(args.list)
        else:
            print("ERROR: cannot list all permission!!")

    if args.filename:
        print('ok')
        if regFile.match(args.filename):
            print('ok 2')
            get_permission(args.filename)
                

